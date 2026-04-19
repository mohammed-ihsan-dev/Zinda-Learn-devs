import express from 'express';
const router = express.Router();
import {
  sendMessage,
  getConversation,
  getConversations
} from '../controllers/messageController.js';
import { protect } from '../middleware/auth.js';

router.post('/', protect, sendMessage);
router.get('/', protect, getConversations);
router.get('/:userId', protect, getConversation);

export default router;

