import User from "../models/User.js";
import Course from "../models/Course.js";
import mongoose from "mongoose";

export const adminService = {
  // 1. Instructor Approval System
  getPendingInstructors: async () => {
    return await User.find({ role: "instructor", isApproved: false }).sort({ createdAt: -1 });
  },

  approveInstructor: async (id) => {
    return await User.findByIdAndUpdate(id, { isApproved: true }, { new: true });
  },

  rejectInstructor: async (id) => {
    // Optional: Could also delete the user, but marking as rejected (if field exists) or deleting is safer
    return await User.findByIdAndDelete(id);
  },

  // 2. User Management
  getAllUsers: async ({ role, email, page = 1, limit = 10 }) => {
    const query = {};
    if (role) query.role = role;
    if (email) query.email = { $regex: email, $options: "i" };

    const users = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await User.countDocuments(query);

    return { users, total };
  },

  blockUser: async (id) => {
    return await User.findByIdAndUpdate(id, { isBlocked: true }, { new: true });
  },

  unblockUser: async (id) => {
    return await User.findByIdAndUpdate(id, { isBlocked: false }, { new: true });
  },

  // 3. Course Management
  getAllCourses: async ({ page = 1, limit = 10 }) => {
    const courses = await Course.find()
      .populate("instructor", "name email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Course.countDocuments();
    return { courses, total };
  },

  deleteCourse: async (id) => {
    return await Course.findByIdAndDelete(id);
  },

  togglePublishStatus: async (id) => {
    const course = await Course.findById(id);
    if (!course) return null;
    course.isPublished = !course.isPublished;
    return await course.save();
  },

  getPendingCourses: async () => {
    return await Course.find({ status: "pending" })
      .populate("instructor", "name email avatar")
      .sort({ createdAt: -1 });
  },

  approveCourse: async (id) => {
    return await Course.findByIdAndUpdate(
      id,
      { status: "published", isApproved: true, isPublished: true },
      { new: true }
    );
  },

  rejectCourse: async (id) => {
    return await Course.findByIdAndUpdate(
      id,
      { status: "rejected", isApproved: false, isPublished: false },
      { new: true }
    );
  },

  // 4. Dashboard Stats
  getDashboardStats: async () => {
    const [
      totalUsers,
      totalStudents,
      totalInstructors,
      totalCourses,
      totalApprovedInstructors
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "student" }),
      User.countDocuments({ role: "instructor" }),
      Course.countDocuments(),
      User.countDocuments({ role: "instructor", isApproved: true })
    ]);

    return {
      totalUsers,
      totalStudents,
      totalInstructors,
      totalCourses,
      totalApprovedInstructors
    };
  }
};
