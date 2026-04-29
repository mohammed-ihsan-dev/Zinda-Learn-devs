import api from './api';

export const getAllCourses = async () => {
  const { data } = await api.get('/admin/courses');
  return data;
};

export const getPendingCourses = async () => {
  const { data } = await api.get('/admin/courses/pending');
  return data;
};

export const approveCourse = async (id) => {
  const { data } = await api.patch(`/admin/courses/${id}/approve`);
  return data;
};

export const declineCourse = async (id, declineReason) => {
  const { data } = await api.patch(`/admin/courses/${id}/decline`, { declineReason });
  return data;
};

export const updateCourseStatus = async (id, status) => {
  const { data } = await api.patch(`/admin/courses/${id}/status`, { status });
  return data;
};

export const getDashboardStats = async () => {
  const { data } = await api.get('/admin/dashboard');
  return data;
};

export const getAllUsers = async (showDeleted = false) => {
  const { data } = await api.get(`/admin/users${showDeleted ? '?showDeleted=true' : ''}`);
  return data;
};

export const createUser = async (userData) => {
  const { data } = await api.post('/admin/users', userData);
  return data;
};

export const updateUser = async (id, userData) => {
  const { data } = await api.put(`/admin/users/${id}`, userData);
  return data;
};

export const deleteUser = async (id) => {
  const { data } = await api.patch(`/admin/users/${id}/delete`);
  return data;
};

export const restoreUser = async (id) => {
  const { data } = await api.patch(`/admin/users/${id}/restore`);
  return data;
};

export const blockUser = async (id) => {
  const { data } = await api.patch(`/admin/users/${id}/block`);
  return data;
};

export const unblockUser = async (id) => {
  const { data } = await api.patch(`/admin/users/${id}/unblock`);
  return data;
};

export const getPendingInstructors = async () => {
  const { data } = await api.get('/admin/instructors/pending');
  return data;
};

export const approveInstructor = async (id) => {
  const { data } = await api.put(`/admin/instructor/${id}/approve`);
  return data;
};

export const rejectInstructor = async (id) => {
  const { data } = await api.delete(`/admin/instructor/${id}`);
  return data;
};
