import Payout from '../models/Payout.js';
import Enrollment from '../models/Enrollment.js';
import Review from '../models/Review.js';
import Course from '../models/Course.js';
import User from '../models/User.js';
import SupportTicket from '../models/SupportTicket.js';
import mongoose from 'mongoose';

// ── PAYOUTS ──────────────────────────────────────────────────────────────────

export const getInstructorPayouts = async (req, res) => {
  try {
    const instructorId = req.user.id;

    // 1. Get all enrollments for this instructor's courses
    const myCourses = await Course.find({ instructor: instructorId }).select('_id');
    const courseIds = myCourses.map(c => c._id);

    const enrollments = await Enrollment.find({ course: { $in: courseIds } })
      .populate('user', 'name email')
      .populate('course', 'title price')
      .sort({ createdAt: -1 });

    // 2. Calculate earnings
    const totalRevenue = enrollments.reduce((acc, curr) => acc + (curr.course?.price || 0), 0);
    const platformFeeRate = 0.1; // 10% platform fee
    const instructorEarnings = totalRevenue * (1 - platformFeeRate);

    // 3. Get payout history
    const payouts = await Payout.find({ instructor: instructorId }).sort({ createdAt: -1 });
    const totalWithdrawn = payouts
      .filter(p => p.status === 'paid' || p.status === 'approved')
      .reduce((acc, curr) => acc + curr.amount, 0);

    const pendingWithdrawn = payouts
      .filter(p => p.status === 'pending')
      .reduce((acc, curr) => acc + curr.amount, 0);

    const availableBalance = instructorEarnings - totalWithdrawn - pendingWithdrawn;

    res.json({
      success: true,
      stats: {
        totalRevenue,
        instructorEarnings,
        totalWithdrawn,
        pendingWithdrawn,
        availableBalance,
        thisMonthEarnings: 0 // Logic to calculate current month can be added
      },
      payouts,
      earnings: enrollments.map(e => ({
        studentName: e.user?.name,
        courseTitle: e.course?.title,
        amount: e.course?.price,
        platformFee: (e.course?.price || 0) * platformFeeRate,
        netEarnings: (e.course?.price || 0) * (1 - platformFeeRate),
        status: 'Success',
        date: e.createdAt
      }))
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const requestWithdrawal = async (req, res) => {
  try {
    const { amount, paymentMethod } = req.body;
    const instructorId = req.user.id;

    if (amount < 500) {
      return res.status(400).json({ success: false, message: 'Minimum withdrawal amount is ₹500' });
    }

    // Check balance
    const user = await User.findById(instructorId);
    if (!user.paymentDetails?.[paymentMethod]) {
      return res.status(400).json({ success: false, message: `Please add your ${paymentMethod} details in settings first` });
    }

    // Logic to verify balance again (similar to getInstructorPayouts)
    // For production, this should be calculated on the fly or stored in a ledger
    
    const newPayout = await Payout.create({
      instructor: instructorId,
      amount,
      paymentMethod: paymentMethod === 'bank' ? 'bank_transfer' : 'upi',
      paymentDetails: paymentMethod === 'bank' ? user.paymentDetails.bank : user.paymentDetails.upi,
      status: 'pending'
    });

    res.json({ success: true, payout: newPayout, message: 'Withdrawal request submitted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── REVIEWS ──────────────────────────────────────────────────────────────────

export const getInstructorReviews = async (req, res) => {
  try {
    const instructorId = req.user.id;
    const myCourses = await Course.find({ instructor: instructorId }).select('_id title');
    const courseIds = myCourses.map(c => c._id);

    const reviews = await Review.find({ course: { $in: courseIds } })
      .populate('user', 'name profilePic avatar')
      .populate('course', 'title')
      .sort({ createdAt: -1 });

    const totalReviews = reviews.length;
    const avgRating = totalReviews > 0 
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1) 
      : 0;

    const distribution = [0, 0, 0, 0, 0];
    reviews.forEach(r => { if(r.rating >= 1 && r.rating <= 5) distribution[5 - r.rating]++; });

    res.json({
      success: true,
      analytics: {
        totalReviews,
        avgRating,
        distribution
      },
      reviews,
      courses: myCourses
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── SETTINGS ─────────────────────────────────────────────────────────────────

export const updateInstructorSettings = async (req, res) => {
  try {
    const instructorId = req.user.id;
    const { name, bio, phone, socialLinks, paymentDetails, notificationPreferences } = req.body;

    const user = await User.findById(instructorId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (phone !== undefined) user.phone = phone;
    if (socialLinks) user.socialLinks = { ...user.socialLinks, ...socialLinks };
    if (paymentDetails) user.paymentDetails = { ...user.paymentDetails, ...paymentDetails };
    if (notificationPreferences) user.notificationPreferences = { ...user.notificationPreferences, ...notificationPreferences };

    await user.save();
    res.json({ success: true, user, message: 'Settings updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── HELP CENTER ──────────────────────────────────────────────────────────────

export const submitSupportTicket = async (req, res) => {
  try {
    const { subject, category, message, attachment } = req.body;
    const ticket = await SupportTicket.create({
      user: req.user.id,
      subject,
      category,
      message,
      attachment
    });
    res.json({ success: true, ticket, message: 'Ticket submitted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getInstructorTickets = async (req, res) => {
  try {
    const tickets = await SupportTicket.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, tickets });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── DASHBOARD & COURSES ──────────────────────────────────────────────────────

export const getInstructorCourses = async (req, res) => {
  try {
    const courses = await Course.find({ 
      instructor: req.user.id, 
      isDeleted: { $ne: true } 
    }).sort({ createdAt: -1 });
    
    res.json({ success: true, courses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getInstructorDashboardStats = async (req, res) => {
  try {
    const instructorId = req.user.id;
    const courses = await Course.find({ instructor: instructorId, isDeleted: { $ne: true } });

    const totalCourses = courses.length;
    const totalStudents = courses.reduce((acc, c) => acc + (c.totalStudents || 0), 0);
    
    // Revenue logic matching getInstructorPayouts for consistency
    const enrollments = await Enrollment.find({ course: { $in: courses.map(c => c._id) } })
      .populate('course', 'price');
    
    const totalRevenue = enrollments.reduce((acc, curr) => acc + (curr.course?.price || 0), 0);
    const platformFeeRate = 0.1;
    const monthlyEarnings = totalRevenue * (1 - platformFeeRate); // This could be filtered by date

    res.json({
      success: true,
      data: {
        totalCourses,
        totalStudents,
        totalRevenue,
        monthlyEarnings
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getInstructorStudents = async (req, res) => {
  try {
    const myCourses = await Course.find({ instructor: req.user.id }).select('_id');
    const courseIds = myCourses.map(c => c._id);

    const enrollments = await Enrollment.find({ course: { $in: courseIds } })
      .populate('user', 'name email profilePic avatar createdAt')
      .populate('course', 'title')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      students: enrollments.map(e => ({
        _id: e.user?._id,
        name: e.user?.name,
        email: e.user?.email,
        profilePic: e.user?.profilePic,
        avatar: e.user?.avatar,
        courseTitle: e.course?.title,
        enrolledAt: e.createdAt
      }))
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
