import express from 'express';
const router = express.Router();
import { createCourse, getInstructorCourses } from '../controllers/courseController.js';
import { protect, authorize } from '../middleware/auth.js';

// All routes require auth + instructor role
router.use(protect, authorize('instructor'));

// POST /api/instructor/courses  — create a course (status defaults to "pending" via service)
router.post('/courses', createCourse);

// GET /api/instructor/courses  — get own courses
router.get('/courses', getInstructorCourses);

export default router;
