import User from '../models/User.js';
import Subscription from '../models/Subscription.js';
import bcrypt from 'bcryptjs';

// @desc    Get student settings
// @route   GET /api/student/settings
export const getSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get student subscription
// @route   GET /api/student/subscription
export const getSubscription = async (req, res) => {
  try {
    let subscription = await Subscription.findOne({ user: req.user.id });
    
    // If no subscription exists, create a default "Free" one
    if (!subscription) {
      subscription = await Subscription.create({
        user: req.user.id,
        plan: 'Free',
        status: 'active',
        renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
      });
    }
    
    res.status(200).json({ success: true, data: subscription });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update student profile
// @route   PUT /api/student/profile
export const updateProfile = async (req, res) => {
  try {
    const { name, email, bio, username, phone, language, avatar } = req.body;
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Update fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (bio !== undefined) user.bio = bio;
    if (username) user.username = username;
    if (phone) user.phone = phone;
    if (language) user.language = language;
    if (avatar) user.avatar = avatar;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update student password
// @route   PUT /api/student/password
export const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    const user = await User.findById(req.user.id);
    
    // Check current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    
    await user.save();

    res.status(200).json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update student preferences (dark mode, video quality)
// @route   PUT /api/student/preferences
export const updatePreferences = async (req, res) => {
  try {
    const { darkMode, videoQuality, twoFactorEnabled } = req.body;
    
    const user = await User.findById(req.user.id);
    
    if (darkMode !== undefined) user.preferences.darkMode = darkMode;
    if (videoQuality) user.preferences.videoQuality = videoQuality;
    if (twoFactorEnabled !== undefined) user.twoFactorEnabled = twoFactorEnabled;

    await user.save();

    res.status(200).json({ success: true, data: user.preferences });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update notification preferences
// @route   PUT /api/student/notifications
export const updateNotifications = async (req, res) => {
  try {
    const { emailNotifications, liveClassReminders, chatMessages, courseUpdates } = req.body;
    
    const user = await User.findById(req.user.id);
    
    if (emailNotifications !== undefined) user.notificationPreferences.emailNotifications = emailNotifications;
    if (liveClassReminders !== undefined) user.notificationPreferences.liveClassReminders = liveClassReminders;
    if (chatMessages !== undefined) user.notificationPreferences.chatMessages = chatMessages;
    if (courseUpdates !== undefined) user.notificationPreferences.courseUpdates = courseUpdates;

    await user.save();

    res.status(200).json({ success: true, data: user.notificationPreferences });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete student account
// @route   DELETE /api/student/delete-account
export const deleteAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // In a real app, you might want to mark as deleted or remove all related data
    await User.findByIdAndDelete(req.user.id);

    res.status(200).json({ success: true, message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
