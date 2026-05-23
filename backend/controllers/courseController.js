import Course from "../models/Course.js";
import { courseService } from "../services/course.service.js";

// Get all courses 
export const getCourses = async (req, res) => {
  try {
    const { page = 1, limit = 12 } = req.query;

    const { courses, total } = await courseService.getPublishedCourses(req.query);

    res.status(200).json({
      success: true,
      courses,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get single course
export const getCourse = async (req, res) => {
  try {
    const course = await courseService.getCourseById(req.params.id, req.user?.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }

    res.status(200).json({
      success: true,
      course
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Create course
export const createCourse = async (req, res) => {
  try {
    if (!req.body.title || !req.body.title.trim()) {
      return res.status(400).json({ success: false, message: "Course title is required" });
    }
    if (!req.body.description || !req.body.description.trim()) {
      return res.status(400).json({ success: false, message: "Course description is required" });
    }

    // Normalize title and category
    const title = req.body.title.trim();
    if (req.body.category) {
      req.body.category = req.body.category.toLowerCase().trim();
    }

    // Escape title for case-insensitive regex query
    const escapedTitle = title.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const titleRegex = new RegExp(`^\\s*${escapedTitle}\\s*$`, 'i');

    // Pre-check for duplicate title for this instructor (case-insensitive and trimmed)
    const existingCourse = await Course.findOne({
      title: { $regex: titleRegex },
      instructor: req.user.id,
      isDeleted: { $ne: true }
    });

    if (existingCourse) {
      return res.status(400).json({
        success: false,
        message: "Course title already exists"
      });
    }

    const course = await courseService.createCourse({ ...req.body, title }, req.user.id);

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      course
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Course title already exists"
      });
    }
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// Update course
export const updateCourse = async (req, res) => {
  try {
    let { title, category } = req.body;

    // Normalize category if present
    if (category) {
      req.body.category = category.toLowerCase().trim();
    }

    // Normalize title if present and check for duplicates
    if (title !== undefined) {
      if (!title || !title.trim()) {
        return res.status(400).json({ success: false, message: "Course title is required" });
      }
      title = title.trim();
      req.body.title = title;

      // Find the instructor of the course being updated
      let instructorId = req.user.id;
      const courseToUpdate = await Course.findById(req.params.id);
      if (courseToUpdate) {
        instructorId = courseToUpdate.instructor.toString();
      }

      // Escape title for case-insensitive regex query
      const escapedTitle = title.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const titleRegex = new RegExp(`^\\s*${escapedTitle}\\s*$`, 'i');

      const existingCourse = await Course.findOne({
        title: { $regex: titleRegex },
        instructor: instructorId,
        _id: { $ne: req.params.id },
        isDeleted: { $ne: true }
      });

      if (existingCourse) {
        return res.status(400).json({
          success: false,
          message: "Course title already exists"
        });
      }
    }

    const course = await courseService.updateCourse(req.params.id, req.body, req.user);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      course
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Course title already exists"
      });
    }
    if (error.message === "Not authorized to update this course") {
      return res.status(403).json({ success: false, message: error.message });
    }
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// Delete course
export const deleteCourse = async (req, res) => {
  try {
    const success = await courseService.deleteCourse(req.params.id, req.user);

    if (!success) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Course deleted successfully"
    });
  } catch (error) {
    if (error.message === "Not authorized to delete this course") {
      return res.status(403).json({ success: false, message: error.message });
    }
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get instructor courses
export const getInstructorCourses = async (req, res) => {
  try {
    const courses = await courseService.getInstructorCourses(req.user.id);

    res.status(200).json({
      success: true,
      courses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get all courses (admin)
export const getAllCoursesAdmin = async (req, res) => {
  try {
    const courses = await courseService.getAllCoursesAdmin();

    res.status(200).json({
      success: true,
      courses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update course status (admin)
export const updateCourseStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const course = await courseService.updateCourseStatus(req.params.id, status);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }

    res.status(200).json({
      success: true,
      message: `Course ${status}`,
      course
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Submit course for review
export const submitCourse = async (req, res) => {
  try {
    const course = await courseService.submitCourseForReview(req.params.id, req.user.id);
    res.status(200).json({
      success: true,
      message: "Course submitted for review",
      course
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get instructor dashboard stats
export const getInstructorStats = async (req, res) => {
  try {
    const instructorId = req.user.id;
    const courses = await Course.find({ instructor: instructorId, isDeleted: { $ne: true } }).lean();

    const totalCourses = courses.length;
    const totalStudents = courses.reduce((acc, c) => acc + (c.totalStudents || 0), 0);
    
    const totalRevenue = courses.reduce((acc, c) => {
      const actualPrice = (c.discountPrice > 0 && c.discountPrice < c.price) ? c.discountPrice : (c.price || 0);
      return acc + ((c.totalStudents || 0) * actualPrice);
    }, 0);

    const monthlyEarnings = totalRevenue * 0.15; // 15% placeholder

    res.status(200).json({
      success: true,
      data: {
        totalCourses,
        totalStudents,
        totalRevenue,
        monthlyEarnings
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// CURRICULUM CRUD — Sections & Lessons
// ═══════════════════════════════════════════════════════════════════════════════

// Helper: verify course ownership
const verifyCourseOwner = async (courseId, user) => {
  const course = await Course.findOne({ _id: courseId, isDeleted: { $ne: true } });
  if (!course) throw { status: 404, message: "Course not found" };
  if (user.role !== "admin" && course.instructor.toString() !== user.id) {
    throw { status: 403, message: "Not authorized" };
  }
  return course;
};

// Return full course with virtuals and populated instructor
const returnFullCourse = async (courseId) => {
  const course = await Course.findById(courseId).populate("instructor", "name avatar bio");
  return course.toObject({ virtuals: true });
};

// POST /courses/:id/sections — Add a new section (module)
export const addSection = async (req, res) => {
  try {
    const course = await verifyCourseOwner(req.params.id, req.user);
    const { title, description } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: "Section title is required" });
    }

    course.modules.push({
      title: title.trim(),
      description: description?.trim() || '',
      order: course.modules.length,
      lessons: []
    });

    await course.save();
    const fullCourse = await returnFullCourse(course._id);

    res.status(201).json({ success: true, message: "Section added", course: fullCourse });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

// PUT /courses/:id/sections/:sectionId — Update section title/description
export const updateSection = async (req, res) => {
  try {
    const course = await verifyCourseOwner(req.params.id, req.user);
    const section = course.modules.id(req.params.sectionId);
    if (!section) return res.status(404).json({ success: false, message: "Section not found" });

    const { title, description } = req.body;
    if (title !== undefined) section.title = title.trim();
    if (description !== undefined) section.description = description.trim();

    await course.save();
    const fullCourse = await returnFullCourse(course._id);

    res.status(200).json({ success: true, message: "Section updated", course: fullCourse });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

// DELETE /courses/:id/sections/:sectionId — Remove a section and all its lessons
export const deleteSection = async (req, res) => {
  try {
    const course = await verifyCourseOwner(req.params.id, req.user);
    const section = course.modules.id(req.params.sectionId);
    if (!section) return res.status(404).json({ success: false, message: "Section not found" });

    course.modules.pull(req.params.sectionId);

    // Re-index order
    course.modules.forEach((mod, i) => { mod.order = i; });

    await course.save();
    const fullCourse = await returnFullCourse(course._id);

    res.status(200).json({ success: true, message: "Section deleted", course: fullCourse });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

// PUT /courses/:id/sections/reorder — Reorder all sections
export const reorderSections = async (req, res) => {
  try {
    const course = await verifyCourseOwner(req.params.id, req.user);
    const { sectionIds } = req.body; // array of module _id strings in desired order

    if (!Array.isArray(sectionIds)) {
      return res.status(400).json({ success: false, message: "sectionIds must be an array" });
    }

    // Reorder by mapping
    const moduleMap = new Map(course.modules.map(m => [m._id.toString(), m]));
    const reordered = [];
    sectionIds.forEach((id, i) => {
      const mod = moduleMap.get(id);
      if (mod) {
        mod.order = i;
        reordered.push(mod);
      }
    });
    course.modules = reordered;

    await course.save();
    const fullCourse = await returnFullCourse(course._id);

    res.status(200).json({ success: true, message: "Sections reordered", course: fullCourse });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

// POST /courses/:id/sections/:sectionId/lessons — Add a lesson to a section
export const addLesson = async (req, res) => {
  try {
    const course = await verifyCourseOwner(req.params.id, req.user);
    const section = course.modules.id(req.params.sectionId);
    if (!section) return res.status(404).json({ success: false, message: "Section not found" });

    const { title, description, videoUrl, duration, isFree, source } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: "Lesson title is required" });
    }

    section.lessons.push({
      title: title.trim(),
      description: description?.trim() || '',
      videoUrl: videoUrl || '',
      source: source || '',
      duration: duration || 0,
      isFree: isFree || false,
      order: section.lessons.length
    });

    await course.save();
    const fullCourse = await returnFullCourse(course._id);

    res.status(201).json({ success: true, message: "Lesson added", course: fullCourse });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

// PUT /courses/:id/sections/:sectionId/lessons/:lessonId — Update a lesson
export const updateLesson = async (req, res) => {
  try {
    const course = await verifyCourseOwner(req.params.id, req.user);
    const section = course.modules.id(req.params.sectionId);
    if (!section) return res.status(404).json({ success: false, message: "Section not found" });

    const lesson = section.lessons.id(req.params.lessonId);
    if (!lesson) return res.status(404).json({ success: false, message: "Lesson not found" });

    const { title, description, videoUrl, duration, isFree, source } = req.body;
    if (title !== undefined) lesson.title = title.trim();
    if (description !== undefined) lesson.description = description.trim();
    if (videoUrl !== undefined) lesson.videoUrl = videoUrl;
    if (source !== undefined) lesson.source = source;
    if (duration !== undefined) lesson.duration = duration;
    if (isFree !== undefined) lesson.isFree = isFree;

    await course.save();
    const fullCourse = await returnFullCourse(course._id);

    res.status(200).json({ success: true, message: "Lesson updated", course: fullCourse });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

// DELETE /courses/:id/sections/:sectionId/lessons/:lessonId — Delete a lesson
export const deleteLesson = async (req, res) => {
  try {
    const course = await verifyCourseOwner(req.params.id, req.user);
    const section = course.modules.id(req.params.sectionId);
    if (!section) return res.status(404).json({ success: false, message: "Section not found" });

    section.lessons.pull(req.params.lessonId);

    // Re-index order
    section.lessons.forEach((l, i) => { l.order = i; });

    await course.save();
    const fullCourse = await returnFullCourse(course._id);

    res.status(200).json({ success: true, message: "Lesson deleted", course: fullCourse });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};