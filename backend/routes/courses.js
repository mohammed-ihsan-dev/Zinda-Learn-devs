import express from 'express';
const router = express.Router();
import {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  getInstructorCourses
} from '../controllers/courseController.js';
import { enroll } from '../controllers/enrollmentController.js';
import { protect, isInstructor, isApprovedInstructor } from '../middleware/auth.js';

// Public routes
router.get('/', getCourses);
router.get('/:id', getCourse);

// Student routes
router.post('/:id/enroll', protect, enroll);

// Instructor routes
router.get('/instructor/my-courses', protect, isInstructor, getInstructorCourses);
router.post('/', protect, isInstructor, isApprovedInstructor, createCourse);
router.put('/:id', protect, isInstructor, isApprovedInstructor, updateCourse);
router.delete('/:id', protect, isInstructor, isApprovedInstructor, deleteCourse);

export default router;
