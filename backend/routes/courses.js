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
import { protect, authorize } from '../middleware/auth.js';

// Public routes
router.get('/', getCourses);
router.get('/:id', getCourse);

// Instructor routes
router.get('/instructor/my-courses', protect, authorize('instructor'), getInstructorCourses);
router.post('/', protect, authorize('instructor'), createCourse);
router.put('/:id', protect, authorize('instructor'), updateCourse);
router.delete('/:id', protect, authorize('instructor'), deleteCourse);

export default router;
