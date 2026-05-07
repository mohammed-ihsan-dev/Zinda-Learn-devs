import api from './api';

export const getCourses = async (params = {}) => {
  const response = await api.get('/courses', { params });
  return response.data;
};



export const getCourseById = async (id) => {
  const response = await api.get(`/courses/${id}`);
  // Handle both { success, course } and { success, data: { course } } or { success, data }
  return response.data.course || response.data.data || response.data;
};

export const updateCourse = async (id, courseData) => {
  const response = await api.put(`/courses/${id}`, courseData);
  return response.data;
};

export const getMyEnrollments = async (params = {}) => {
  const response = await api.get('/enrollments', { params });
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

export const submitCourse = async (id) => {
  const response = await api.patch(`/courses/${id}/submit`);
  return response.data;
};

export const enrollInCourse = async (courseId) => {
  const response = await api.post('/enrollments/enroll', { courseId });
  return response.data;
};
