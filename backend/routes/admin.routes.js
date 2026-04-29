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
  togglePublishStatus,
  getPendingCourses,
  approveCourse,
  rejectCourse,
  getDashboardStats
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
router.patch('/courses/:id/toggle-publish', togglePublishStatus);
router.put('/course/:id/approve', approveCourse);
router.put('/course/:id/reject', rejectCourse);

// 4. Dashboard Stats
router.get('/dashboard', getDashboardStats);

export default router;
