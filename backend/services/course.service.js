import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";

export const courseService = {
  getPublishedCourses: async ({ category, level, search, sort, page = 1, limit = 12 }) => {
    const query = { status: "published", isApproved: true };

    if (category) query.category = category;
    if (level) query.level = level;

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    let sortQuery = {};
    switch (sort) {
      case "popular":
        sortQuery = { totalStudents: -1 };
        break;
      case "newest":
        sortQuery = { createdAt: -1 };
        break;
      case "rating":
        sortQuery = { rating: -1 };
        break;
      case "price-low":
        sortQuery = { price: 1 };
        break;
      case "price-high":
        sortQuery = { price: -1 };
        break;
      default:
        sortQuery = { createdAt: -1 };
    }

    const [courses, total] = await Promise.all([
      Course.find(query)
        .populate("instructor", "name avatar")
        .sort(sortQuery)
        .skip((page - 1) * limit)
        .limit(Number(limit)),
      Course.countDocuments(query)
    ]);

    return { courses, total };
  },

  getCourseById: async (id) => {
    return await Course.findById(id).populate("instructor", "name avatar bio");
  },

  createCourse: async (courseData, instructorId) => {
    return await Course.create({ ...courseData, instructor: instructorId });
  },

  updateCourse: async (id, updateData, user) => {
    const course = await Course.findById(id);
    if (!course) return null;

    if (course.instructor.toString() !== user.id && user.role !== "admin") {
      throw new Error("Not authorized to update this course");
    }

    return await Course.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    });
  },

  deleteCourse: async (id, user) => {
    const course = await Course.findById(id);
    if (!course) return null;

    if (course.instructor.toString() !== user.id && user.role !== "admin") {
      throw new Error("Not authorized to delete this course");
    }

    await Promise.all([
      Course.findByIdAndDelete(id),
      Enrollment.deleteMany({ course: id })
    ]);

    return true;
  },

  getInstructorCourses: async (instructorId) => {
    return await Course.find({ instructor: instructorId }).sort({ createdAt: -1 });
  },

  getAllCoursesAdmin: async () => {
    return await Course.find().populate("instructor", "name email").sort({ createdAt: -1 });
  },

  updateCourseStatus: async (id, status) => {
    return await Course.findByIdAndUpdate(
      id,
      { status, isApproved: status === "published" },
      { new: true }
    );
  }
};
