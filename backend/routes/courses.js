import express from 'express';
const router = express.Router();
import {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  getInstructorCourses,
  submitCourse,
  addSection,
  updateSection,
  deleteSection,
  reorderSections,
  addLesson,
  updateLesson,
  deleteLesson
} from '../controllers/courseController.js';
import {
  getCourseReviews,
  addReview,
  updateReview,
  deleteReview
} from '../controllers/reviewController.js';
import { protect, isInstructor, isApprovedInstructor, authorize, optionalProtect } from '../middleware/auth.js';

// Review routes
router.get('/:courseId/reviews', getCourseReviews);
router.post('/:courseId/reviews', protect, addReview);
router.put('/:courseId/reviews/:id', protect, updateReview);
router.delete('/:courseId/reviews/:id', protect, deleteReview);

// Curriculum routes (sections & lessons)
router.post('/:id/sections', protect, authorize('instructor', 'admin'), addSection);
router.put('/:id/sections/reorder', protect, authorize('instructor', 'admin'), reorderSections);
router.put('/:id/sections/:sectionId', protect, authorize('instructor', 'admin'), updateSection);
router.delete('/:id/sections/:sectionId', protect, authorize('instructor', 'admin'), deleteSection);
router.post('/:id/sections/:sectionId/lessons', protect, authorize('instructor', 'admin'), addLesson);
router.put('/:id/sections/:sectionId/lessons/:lessonId', protect, authorize('instructor', 'admin'), updateLesson);
router.delete('/:id/sections/:sectionId/lessons/:lessonId', protect, authorize('instructor', 'admin'), deleteLesson);

// Public routes
router.get('/', getCourses);
router.get('/:id', optionalProtect, getCourse);

// Instructor routes
router.post('/', protect, isInstructor, isApprovedInstructor, createCourse);
router.put('/:id', protect, authorize('instructor', 'admin'), updateCourse);
router.delete('/:id', protect, isInstructor, isApprovedInstructor, deleteCourse);
router.patch('/:id/submit', protect, isInstructor, isApprovedInstructor, submitCourse);

export default router;

