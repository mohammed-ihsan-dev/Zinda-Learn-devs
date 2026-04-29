import express from 'express';
import { getUserNotifications, markNotificationAsRead } from '../controllers/notification.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All notification routes require authentication
router.use(protect);

router.get('/', getUserNotifications);
router.patch('/:id/read', markNotificationAsRead);

export default router;
