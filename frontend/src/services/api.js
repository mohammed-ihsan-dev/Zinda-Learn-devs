import axios from 'axios';

const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';
const baseURL = import.meta.env.VITE_API_URL || (isLocalhost ? 'http://localhost:5001/api' : 'https://zinda-learn-backend.onrender.com/api');

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('zinda_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
