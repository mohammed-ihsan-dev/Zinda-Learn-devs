import express from 'express';
const router = express.Router();
import { createCourse, getInstructorCourses, updateCourse, deleteCourse } from '../controllers/courseController.js';
import { protect, isInstructor, isApprovedInstructor } from '../middleware/auth.js';

// All routes require auth + instructor role
router.use(protect, isInstructor);

// POST /api/instructor/course  — create a course
router.post('/course', isApprovedInstructor, createCourse);

// GET /api/instructor/my-courses  — get own courses
router.get('/my-courses', getInstructorCourses);

// PUT /api/instructor/course/:id — edit course
router.put('/course/:id', isApprovedInstructor, updateCourse);

// DELETE /api/instructor/course/:id — delete course
router.delete('/course/:id', isApprovedInstructor, deleteCourse);

export default router;
