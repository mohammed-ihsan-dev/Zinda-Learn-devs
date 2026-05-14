import api from './api';

export const getSettings = async () => {
  const response = await api.get('/student/settings');
  return response.data;
};

export const getSubscription = async () => {
  const response = await api.get('/student/settings/subscription');
  return response.data;
};

export const updateProfile = async (profileData) => {
  const response = await api.put('/student/settings/profile', profileData);
  return response.data;
};

export const updatePassword = async (passwordData) => {
  const response = await api.put('/student/settings/password', passwordData);
  return response.data;
};

export const updatePreferences = async (preferencesData) => {
  const response = await api.put('/student/settings/preferences', preferencesData);
  return response.data;
};

export const updateNotifications = async (notificationData) => {
  const response = await api.put('/student/settings/notifications', notificationData);
  return response.data;
};

export const deleteAccount = async () => {
  const response = await api.delete('/student/settings/delete-account');
  return response.data;
};
