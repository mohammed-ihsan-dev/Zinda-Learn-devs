import api from './api';

export const createCourse = async (courseData) => {
  const { data } = await api.post('/instructor/course', courseData);
  return data;
};

export const getInstructorCourses = async () => {
  const { data } = await api.get('/instructor/my-courses');
  return data;
};

export const updateCourse = async (id, courseData) => {
  const { data } = await api.put(`/instructor/course/${id}`, courseData);
  return data;
};

export const deleteCourse = async (id) => {
  const { data } = await api.delete(`/instructor/course/${id}`);
  return data;
};

export const submitCourse = async (id) => {
  const { data } = await api.patch(`/courses/${id}/submit`);
  return data;
};
