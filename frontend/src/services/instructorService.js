import api from './api';

export const createCourse = async (courseData) => {
  const { data } = await api.post('/courses', courseData);
  return data;
};

export const getInstructorCourses = async () => {
  const { data } = await api.get('/courses/instructor/my-courses');
  return data;
};

export const updateCourse = async (id, courseData) => {
  const { data } = await api.put(`/courses/${id}`, courseData);
  return data;
};

export const deleteCourse = async (id) => {
  const { data } = await api.delete(`/courses/${id}`);
  return data;
};

export const submitCourse = async (id) => {
  const { data } = await api.patch(`/courses/${id}/submit`);
  return data;
};
