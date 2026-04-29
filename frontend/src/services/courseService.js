import api from './api';

export const getCourses = async () => {
  const response = await api.get('/courses');
  return response.data;
};



export const getCourseById = async (id) => {
  const response = await api.get(`/courses/${id}`);
  return response.data;
};

export const getMyEnrollments = async () => {
  const response = await api.get('/enrollments');
  return response.data;
};

export const updateProgress = async (enrollmentId, { lessonId, moduleIndex, lessonIndex }) => {
  const response = await api.put(`/enrollments/${enrollmentId}/progress`, {
    lessonId,
    moduleIndex,
    lessonIndex,
  });
  return response.data;
};
