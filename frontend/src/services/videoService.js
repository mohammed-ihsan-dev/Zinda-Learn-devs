import api from './api';
import axios from 'axios';

export const videoService = {
  getSignature: async (courseId) => {
    const response = await api.post('/videos/signature', { courseId });
    return response.data;
  },

  saveVideoMetadata: async (data) => {
    const response = await api.post('/videos', data);
    return response.data;
  },

  deleteVideo: async (id) => {
    const response = await api.delete(`/videos/${id}`);
    return response.data;
  },

  getCourseVideos: async (courseId) => {
    const response = await api.get(`/videos/course/${courseId}`);
    return response.data;
  },

  /**
   * Direct upload to Cloudinary using signed signature
   */
  uploadToCloudinary: async (file, signatureData, onProgress) => {
    const { signature, timestamp, apiKey, cloudName, folder } = signatureData;
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', apiKey);
    formData.append('timestamp', timestamp);
    formData.append('signature', signature);
    formData.append('folder', folder);

    const url = `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`;

    return await axios.post(url, formData, {
      onUploadProgress: (progressEvent) => {
        if (onProgress) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentCompleted);
        }
      }
    });
  }
};
