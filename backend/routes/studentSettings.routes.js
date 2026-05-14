import express from 'express';
const router = express.Router();
import { 
  getSettings, 
  getSubscription, 
  updateProfile, 
  updatePassword, 
  updatePreferences, 
  updateNotifications, 
  deleteAccount 
} from '../controllers/studentSettings.controller.js';
import { protect } from '../middleware/auth.js';

router.get('/', protect, getSettings);
router.get('/subscription', protect, getSubscription);
router.put('/profile', protect, updateProfile);
router.put('/password', protect, updatePassword);
router.put('/preferences', protect, updatePreferences);
router.put('/notifications', protect, updateNotifications);
router.delete('/delete-account', protect, deleteAccount);

export default router;
