import express from 'express';
const router = express.Router();
import { register, login, getMe, updateProfile, changePassword, googleLogin } from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.js';

router.post('/register', register);
router.post('/login', login);
router.post('/google-login', googleLogin);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/password', protect, changePassword);

export default router;
