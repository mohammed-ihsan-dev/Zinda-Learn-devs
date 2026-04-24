import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";
import User from "../models/User.js";

// @desc    Create Razorpay Order (Mocked for now)
// @route   POST /api/payment/create-order
// @access  Private
export const createOrder = async (req, res) => {
  try {
    const { courseId } = req.body;
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    // Check if already enrolled
    const existing = await Enrollment.findOne({ user: req.user.id, course: courseId });
    if (existing && existing.paymentStatus === 'completed') {
      return res.status(400).json({ success: false, message: "Already enrolled in this course" });
    }

    const amount = course.discountPrice || course.price;

    // TODO: Integrate Razorpay here
    // const options = { amount: amount * 100, currency: "INR", receipt: `rcptid_${req.user.id}` };
    // const order = await razorpay.orders.create(options);
    
    // Mocking Razorpay Order for now
    const mockOrderId = "order_" + Math.random().toString(36).substr(2, 9);

    res.status(200).json({
      success: true,
      orderId: mockOrderId,
      amount: amount,
      currency: "INR"
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Verify Payment & Enroll
// @route   POST /api/payment/verify
// @access  Private
export const verifyPayment = async (req, res) => {
  try {
    const { paymentId, orderId, signature, courseId } = req.body;
    
    // TODO: Verify Razorpay signature
    // const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET).update(orderId + "|" + paymentId).digest('hex');
    // if (expectedSignature !== signature) { return res.status(400).json({success: false, message: 'Invalid payment signature'}); }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    const amountPaid = course.discountPrice || course.price;

    // Enroll user after successful payment
    const existing = await Enrollment.findOne({ user: req.user.id, course: courseId });
    if (existing && existing.paymentStatus === 'completed') {
      return res.status(400).json({ success: false, message: "Already enrolled" });
    }

    let enrollment;
    if (existing) {
       existing.paymentStatus = 'completed';
       existing.paymentId = paymentId || 'mock_payment_id';
       existing.amountPaid = amountPaid;
       await existing.save();
       enrollment = existing;
    } else {
       enrollment = await Enrollment.create({
         user: req.user.id,
         course: courseId,
         paymentStatus: 'completed',
         paymentId: paymentId || 'mock_payment_id',
         amountPaid
       });
    }

    // Update course and user
    await Promise.all([
      Course.findByIdAndUpdate(courseId, { $inc: { totalStudents: 1 } }),
      User.findByIdAndUpdate(req.user.id, { $addToSet: { enrolledCourses: courseId } })
    ]);

    res.status(200).json({
      success: true,
      message: "Payment verified and enrolled successfully",
      enrollment
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
