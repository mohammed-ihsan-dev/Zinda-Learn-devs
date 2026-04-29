import express from 'express';
const router = express.Router();
import { 
  getPendingInstructors,
  approveInstructor,
  rejectInstructor,
  getAllUsers,
  blockUser,
  unblockUser,
  deleteUser,
  restoreUser,
  createUser,
  updateUser,
  getAllCourses,
  deleteCourse,
  updateCourseStatus,
  getPendingCourses,
  approveCourse,
  declineCourse,
  getDashboardStats,
  getPayments
} from '../controllers/admin.controller.js';
import { protect, authorize } from '../middleware/auth.js';

// All routes require auth + admin role
router.use(protect, authorize('admin'));

// 1. Instructor Approval System
router.get('/instructors/pending', getPendingInstructors);
router.put('/instructor/:id/approve', approveInstructor);
router.delete('/instructor/:id', rejectInstructor);

// 2. User Management
router.get('/users', getAllUsers);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.patch('/users/:id/block', blockUser);
router.patch('/users/:id/unblock', unblockUser);
router.patch('/users/:id/delete', deleteUser);
router.patch('/users/:id/restore', restoreUser);

// 3. Course Management
router.get('/courses', getAllCourses);
router.get('/courses/pending', getPendingCourses);
router.delete('/courses/:id', deleteCourse);
router.patch('/courses/:id/status', updateCourseStatus);
router.patch('/courses/:id/approve', approveCourse);
router.patch('/courses/:id/decline', declineCourse);

// 4. Dashboard & Finances
router.get('/dashboard', getDashboardStats);
router.get('/payments', getPayments);

export default router;
