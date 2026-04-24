import api from './api';

export const createCourse = async (courseData) => {
  const { data } = await api.post('/instructor/courses', courseData);
  return data;
};

export const getInstructorCourses = async () => {
  const { data } = await api.get('/instructor/courses');
  return data;
};
