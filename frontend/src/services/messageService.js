import api from './api';

export const getConversations = async () => {
  const response = await api.get('/messages');
  return response.data;
};

export const getConversation = async (userId) => {
  const response = await api.get(`/messages/${userId}`);
  return response.data;
};

export const sendMessage = async (receiverId, message) => {
  const response = await api.post('/messages', { receiverId, message });
  return response.data;
};
