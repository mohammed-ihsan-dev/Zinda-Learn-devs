import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";

export const courseService = {
  getPublishedCourses: async ({ category, level, search, minPrice, maxPrice, sort, page = 1, limit = 12 }) => {
    const query = { status: "published", isApproved: true, isDeleted: { $ne: true } };

    if (category) query.category = category;
    if (level) query.level = level;

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (search) {
      query.$text = { $search: search };
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
    return await Course.findOne({ _id: id, isDeleted: { $ne: true } }).populate("instructor", "name avatar bio");
  },

  getCourseBySlug: async (slug) => {
    return await Course.findOne({ slug, isDeleted: { $ne: true } }).populate("instructor", "name avatar bio");
  },

  createCourse: async (courseData, instructorId) => {
    const course = new Course({ ...courseData, instructor: instructorId });
    await course.save();
    
    // Trigger notification
    import('./notification.service.js').then(({ notificationService }) => {
      notificationService.createNotification({
        userId: instructorId,
        title: "Course Created",
        message: `Your course "${course.title}" has been created successfully.`,
        type: "success"
      }).catch(console.error);
    });
    return course;
  },

  updateCourse: async (id, updateData, user) => {
    const course = await Course.findById(id);
    if (!course || course.isDeleted) return null;

    // Ownership check (Instructor)
    if (user.role === "instructor" && course.instructor.toString() !== user.id) {
      throw new Error("Not authorized to update this course");
    }

    // Update fields
    Object.keys(updateData).forEach(key => {
      course[key] = updateData[key];
    });

    // Set audit fields
    course.updatedBy = user.id;

    // If published, move back to pending for re-review
    if (course.status === "published") {
      course.status = "pending";
      course.isApproved = false;
      course.isPublished = false;
    }

    return await course.save();
  },

  deleteCourse: async (id, user) => {
    const course = await Course.findById(id);
    if (!course) return null;

    if (course.instructor.toString() !== user.id && user.role !== "admin") {
      throw new Error("Not authorized to delete this course");
    }

    // Soft delete
    course.isDeleted = true;
    course.status = 'draft';
    await course.save();

    // Still delete enrollments or keep them? Usually keep them for history but hide course.
    // For now, let's just mark as deleted.
    return true;
  },

  getInstructorCourses: async (instructorId) => {
    return await Course.find({ instructor: instructorId, isDeleted: { $ne: true } }).sort({ createdAt: -1 });
  },

  getAllCoursesAdmin: async () => {
    return await Course.find({ isDeleted: { $ne: true } }).populate("instructor", "name email").sort({ createdAt: -1 });
  },

  updateCourseStatus: async (id, status) => {
    const course = await Course.findById(id);
    if (!course) return null;

    course.status = status;
    return await course.save();
  },

  submitCourseForReview: async (id, instructorId) => {
    const course = await Course.findById(id);
    if (!course) throw new Error("Course not found");
    if (course.instructor.toString() !== instructorId) throw new Error("Not authorized");

    course.status = 'pending';
    return await course.save();
  }
};
