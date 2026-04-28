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
  const { data } = await api.put(`/admin/course/${id}/approve`);
  return data;
};

export const rejectCourse = async (id) => {
  const { data } = await api.put(`/admin/course/${id}/reject`);
  return data;
};

export const getDashboardStats = async () => {
  const { data } = await api.get('/admin/dashboard');
  return data;
};

export const getAllUsers = async () => {
  const { data } = await api.get('/admin/users');
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
