import express from 'express';
import { 
  getUploadSignature, 
  saveVideoMetadata, 
  deleteVideo, 
  getCourseVideos 
} from '../controllers/videoController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All video routes require authentication
router.use(protect);

// Only instructors and admins can upload and manage metadata
router.post('/signature', authorize('instructor', 'admin'), getUploadSignature);
router.post('/', authorize('instructor', 'admin'), saveVideoMetadata);
router.delete('/:id', authorize('instructor', 'admin'), deleteVideo);

// Students can fetch videos for a course
router.get('/course/:courseId', getCourseVideos);

export default router;
