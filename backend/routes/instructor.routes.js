import express from 'express';
import { 
  getInstructorPayouts, 
  requestWithdrawal, 
  getInstructorReviews, 
  updateInstructorSettings, 
  submitSupportTicket, 
  getInstructorTickets,
  getInstructorCourses,
  getInstructorDashboardStats,
  getInstructorStudents
} from '../controllers/instructor.controller.js';
import { 
  createCourse, 
  updateCourse, 
  deleteCourse 
} from '../controllers/courseController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected and restricted to instructors
router.use(protect);
router.use(authorize('instructor'));

// Payouts
router.get('/payouts', getInstructorPayouts);
router.post('/withdraw', requestWithdrawal);

// Reviews
router.get('/reviews', getInstructorReviews);

// Settings
router.put('/settings', updateInstructorSettings);

// Dashboard & Courses
router.get('/my-courses', getInstructorCourses);
router.get('/stats', getInstructorDashboardStats);
router.get('/students', getInstructorStudents);
router.post('/course', createCourse);
router.put('/course/:id', updateCourse);
router.delete('/course/:id', deleteCourse);

// Help Center / Support
router.post('/support/tickets', submitSupportTicket);
router.get('/support/tickets', getInstructorTickets);

export default router;
