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

  // 1.5 Student Management
  getStudents: async ({ search, status, page = 1, limit = 20 }) => {
    const query = { role: "student", deletedAt: null };
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ];
    }
    
    if (status === 'blocked') query.isBlocked = true;
    if (status === 'active') query.isBlocked = false;

    const { items: students, pagination } = await paginate(User, query, {
      page,
      limit,
      sort: { createdAt: -1 },
      select: "-password"
    });

    // Fetch enrollment insights for each student
    const Enrollment = mongoose.model("Enrollment");
    const studentsWithInsights = await Promise.all(students.map(async (student) => {
      const enrollments = await Enrollment.find({ user: student._id });
      const totalSpent = enrollments.reduce((sum, enr) => sum + (enr.amountPaid || 0), 0);
      const avgProgress = enrollments.length > 0 
        ? Math.round(enrollments.reduce((sum, enr) => sum + (enr.progress || 0), 0) / enrollments.length)
        : 0;

      return {
        ...student.toObject(),
        enrolledCount: enrollments.length,
        totalSpent,
        avgProgress
      };
    }));

    return { students: studentsWithInsights, pagination };
  },

  getStudentStats: async () => {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const [totalStudents, activeStudents, newStudents, enrollments] = await Promise.all([
      User.countDocuments({ role: "student", deletedAt: null }),
      User.countDocuments({ role: "student", deletedAt: null, isBlocked: false }),
      User.countDocuments({ role: "student", deletedAt: null, createdAt: { $gte: startOfMonth } }),
      mongoose.model("Enrollment").find()
    ]);

    const avgCompletion = enrollments.length > 0
      ? Math.round(enrollments.reduce((sum, enr) => sum + (enr.progress || 0), 0) / enrollments.length)
      : 0;

    return {
      totalStudents,
      activeStudents,
      newStudents,
      avgCompletion
    };
  },
  getTutors: async ({ search, page = 1, limit = 20 }) => {
    const query = { role: "instructor", deletedAt: null, isApproved: true };
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ];
    }

    const { items: tutors, pagination } = await paginate(User, query, {
      page,
      limit,
      sort: { createdAt: -1 },
      select: "-password"
    });

    return { tutors, pagination };
  },
  getAllUsers: async ({ role, email, page = 1, limit = 50, showDeleted }) => {
    const query = {};
    if (role) query.role = role;
    if (email) query.email = { $regex: email, $options: "i" };

    // Handle Soft Delete Logic
    if (showDeleted === "true") {
      query.deletedAt = { $ne: null };
    } else {
      query.deletedAt = null;
    }

    const { items: users, pagination } = await paginate(User, query, {
      page,
      limit,
      sort: { createdAt: -1 },
      select: "-password",
      populate: { path: "deletedBy", select: "name email" }
    });

    return { users, pagination };
  },

  createUser: async (userData) => {
    const { name, email, role, password } = userData;
    const userExists = await User.findOne({ email });
    if (userExists) throw new Error("User with this email already exists");
    
    const user = await User.create({
      name,
      email,
      password: password || "ZindaLearn123!", // default password if none provided
      role: role || "student",
      isApproved: role === "instructor" ? false : true,
    });
    
    return await User.findById(user._id).select("-password");
  },

  updateUser: async (id, updateData) => {
    if (updateData.password) {
      delete updateData.password; // Do not allow password update through this generic endpoint
    }
    return await User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).select("-password");
  },

  deleteUser: async (id, adminId) => {
    // Soft Delete Implementation
    return await User.findByIdAndUpdate(
      id,
      { 
        deletedAt: new Date(),
        deletedBy: adminId
      },
      { new: true }
    );
  },

  restoreUser: async (id) => {
    return await User.findByIdAndUpdate(
      id,
      { 
        deletedAt: null,
        deletedBy: null
      },
      { new: true }
    );
  },

  blockUser: async (id) => {
    return await User.findByIdAndUpdate(id, { isBlocked: true }, { new: true });
  },

  unblockUser: async (id) => {
    return await User.findByIdAndUpdate(id, { isBlocked: false }, { new: true });
  },

  // 3. Course Management
  getAllCourses: async ({ status, search, page = 1, limit = 10 }) => {
    const query = {};
    if (status) query.status = status;
    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    const { items: courses, pagination } = await paginate(Course, query, {
      page,
      limit,
      sort: { createdAt: -1 },
      populate: { path: "instructor", select: "name email" }
    });

    return { courses, pagination };
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

  approveCourse: async (id, adminId) => {
    return await Course.findByIdAndUpdate(
      id,
      { 
        status: "published", 
        isApproved: true, 
        isPublished: true,
        reviewedAt: new Date(),
        reviewedBy: adminId
      },
      { new: true }
    );
  },

  declineCourse: async (id, reason, adminId) => {
    return await Course.findByIdAndUpdate(
      id,
      { 
        status: "declined", 
        isApproved: false, 
        isPublished: false,
        declineReason: reason,
        reviewedAt: new Date(),
        reviewedBy: adminId
      },
      { new: true }
    );
  },

  updateCourseStatus: async (id, status, adminId) => {
    return await Course.findByIdAndUpdate(
      id,
      { 
        status, 
        isPublished: status === 'published',
        reviewedAt: new Date(),
        reviewedBy: adminId
      },
      { new: true }
    );
  },

  // 4. Dashboard Stats
  getDashboardStats: async () => {
    // Basic counts
    const [
      totalUsers,
      totalStudents,
      totalInstructors,
      totalCourses,
      pendingTutors,
      pendingCoursesCount,
      totalEnrollments,
      enrollments,
      latestUsers,
      latestCourses
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "student" }),
      User.countDocuments({ role: "instructor" }),
      Course.countDocuments(),
      User.countDocuments({ role: "instructor", isApproved: false }),
      Course.countDocuments({ status: "pending" }),
      mongoose.model("Enrollment").countDocuments({ paymentStatus: "completed" }),
      mongoose.model("Enrollment").find({ paymentStatus: "completed" }).populate("course"),
      User.find({ role: "instructor" }).sort({ createdAt: -1 }).limit(5).select("name email createdAt isApproved role"),
      Course.find().populate("instructor", "name").sort({ createdAt: -1 }).limit(5).select("title category createdAt status")
    ]);

    const totalRevenue = enrollments.reduce((sum, current) => sum + (current.amountPaid || 0), 0);

    // Calculate revenue breakdown by category
    const breakdownMap = {};
    enrollments.forEach(enr => {
      const category = enr.course?.category || 'General';
      if (!breakdownMap[category]) breakdownMap[category] = 0;
      breakdownMap[category] += (enr.amountPaid || 0);
    });
    
    const revenueBreakdown = Object.keys(breakdownMap).map(category => ({
      category,
      amount: breakdownMap[category]
    })).sort((a, b) => b.amount - a.amount);

    // Calculate user growth by month (for the last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const userGrowthData = await User.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const userGrowth = userGrowthData.map(item => ({
      month: monthNames[item._id - 1],
      users: item.count
    }));

    // Combine recent activity
    const mappedUsers = latestUsers.map(u => ({
      id: u._id,
      type: "user",
      title: `New Tutor Registered: ${u.name}`,
      subtitle: u.email,
      date: u.createdAt,
      status: u.isApproved ? "Approved" : "Pending"
    }));

    const mappedCourses = latestCourses.map(c => ({
      id: c._id,
      type: "course",
      title: `New Course Created: ${c.title}`,
      subtitle: `By ${c.instructor?.name || 'Unknown'} - ${c.category}`,
      date: c.createdAt,
      status: c.status
    }));

    const recentActivity = [...mappedUsers, ...mappedCourses]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);

    // Mocking latest insight since there is no insight model yet
    const latestInsight = {
      title: "Platform Growth Insight",
      description: "Retention rates have increased by 15% following the UI update and successful enrollment flow stabilization.",
      date: new Date()
    };

    return {
      totalUsers,
      totalStudents,
      totalInstructors,
      totalCourses,
      pendingTutors,
      pendingCoursesCount,
      totalEnrollments,
      totalRevenue,
      userGrowth,
      revenueBreakdown,
      recentActivity,
      latestInsight
    };
  },

  getPayments: async ({ page = 1, limit = 50 }) => {
    const Enrollment = mongoose.model("Enrollment");
    const query = { paymentStatus: "completed" };
    
    const { items: payments, pagination } = await paginate(Enrollment, query, {
      page,
      limit,
      sort: { createdAt: -1 },
      populate: [
        { path: "user", select: "name email avatar" },
        { path: "course", select: "title" }
      ]
    });

    return { payments, pagination };
  }
};
