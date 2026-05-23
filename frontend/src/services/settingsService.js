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

export const uploadAvatar = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', 'zinda-learn/students/avatars');
  const response = await api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const sendVerificationEmail = async () => {
  const response = await api.post('/student/settings/send-verification-email');
  return response.data;
};

export const verifyEmailToken = async (token) => {
  const response = await api.post(`/student/settings/verify-email/${token}`);
  return response.data;
};
