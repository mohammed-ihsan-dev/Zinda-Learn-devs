import api from './api';

export const createPaymentOrder = async (courseId) => {
  const response = await api.post('/payment/create-order', { courseId });
  return response.data;
};

export const verifyPayment = async (paymentData) => {
  const response = await api.post('/payment/verify', paymentData);
  return response.data;
};
