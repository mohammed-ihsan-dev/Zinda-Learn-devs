import express from 'express';
const router = express.Router();
import {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  getInstructorCourses,
  submitCourse
} from '../controllers/courseController.js';
import { protect, isInstructor, isApprovedInstructor } from '../middleware/auth.js';

// Public routes
router.get('/', getCourses);
router.get('/:id', getCourse);

// Instructor routes
router.get('/instructor/my-courses', protect, isInstructor, getInstructorCourses);
router.post('/', protect, isInstructor, isApprovedInstructor, createCourse);
router.put('/:id', protect, isInstructor, isApprovedInstructor, updateCourse);
router.delete('/:id', protect, isInstructor, isApprovedInstructor, deleteCourse);
router.patch('/:id/submit', protect, isInstructor, isApprovedInstructor, submitCourse);

export default router;
