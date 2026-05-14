import { paymentService } from '../services/payment.service.js';
import Order from '../models/Order.js';
import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';

export const createOrder = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Create Razorpay Order
    const receipt = `rcpt_${Date.now()}_${courseId.substring(0, 5)}`;
    const razorpayOrder = await paymentService.createRazorpayOrder(
      course.price,
      course.currency || 'INR',
      receipt
    );

    // Save Order in Database
    const order = new Order({
      user: userId,
      course: courseId,
      amount: course.price,
      currency: course.currency || 'INR',
      razorpayOrderId: razorpayOrder.id,
      status: 'created'
    });

    await order.save();

    res.status(201).json({
      success: true,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error('Create Order Error:', error);
    res.status(500).json({ success: false, message: 'Failed to create order' });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const isVerified = paymentService.verifySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isVerified) {
      return res.status(400).json({ success: false, message: 'Payment verification failed' });
    }

    // Update Order in Database
    const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.status = 'paid';
    order.razorpayPaymentId = razorpay_payment_id;
    order.razorpaySignature = razorpay_signature;
    await order.save();

    // Create Enrollment
    const enrollment = new Enrollment({
      user: order.user,
      course: order.course,
      paymentStatus: 'completed',
      paymentId: razorpay_payment_id,
      amountPaid: order.amount,
      enrolledAt: new Date()
    });
    await enrollment.save();

    // Update Course and User
    await Promise.all([
      Course.findByIdAndUpdate(order.course, { 
        $inc: { totalStudents: 1 },
        $addToSet: { students: order.user }
      }),
      User.findByIdAndUpdate(order.user, { $addToSet: { enrolledCourses: order.course } })
    ]);

    // Trigger notification
    try {
      const course = await Course.findById(order.course);
      const { notificationService } = await import('../services/notification.service.js');
      await notificationService.createNotification({
        userId: order.user,
        title: "Course Enrolled",
        message: `Payment successful! You have been enrolled in "${course.title}".`,
        type: "success"
      });
    } catch (notifErr) {
      console.error("Notification failed:", notifErr);
    }

    res.status(200).json({
      success: true,
      message: 'Payment verified and enrollment successful',
      enrollment
    });
  } catch (error) {
    console.error('Verify Payment Error:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
