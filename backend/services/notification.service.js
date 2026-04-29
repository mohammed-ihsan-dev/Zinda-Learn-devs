import Notification from '../models/Notification.js';

export const notificationService = {
  getUserNotifications: async (userId) => {
    return await Notification.find({ userId }).sort({ createdAt: -1 }).limit(50);
  },

  markAsRead: async (id, userId) => {
    return await Notification.findOneAndUpdate(
      { _id: id, userId },
      { isRead: true },
      { new: true }
    );
  },

  createNotification: async ({ userId, title, message, type = 'info' }) => {
    return await Notification.create({ userId, title, message, type });
  }
};
