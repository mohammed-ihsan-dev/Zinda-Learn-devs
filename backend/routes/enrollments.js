import express from 'express';
const router = express.Router();
import {
  getMyEnrollments,
  updateProgress,
  getInstructorStats
} from '../controllers/enrollmentController.js';
import { protect, authorize } from '../middleware/auth.js';

router.get('/', protect, getMyEnrollments);
router.put('/:id/progress', protect, updateProgress);
router.get('/instructor/stats', protect, authorize('instructor'), getInstructorStats);

export default router;

