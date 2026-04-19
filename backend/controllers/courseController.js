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
    const course = await courseService.getCourseById(req.params.id);

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
    const course = await courseService.createCourse(req.body, req.user.id);

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      course
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update course
export const updateCourse = async (req, res) => {
  try {
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
    if (error.message === "Not authorized to update this course") {
      return res.status(403).json({ success: false, message: error.message });
    }
    res.status(500).json({
      success: false,
      message: error.message
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