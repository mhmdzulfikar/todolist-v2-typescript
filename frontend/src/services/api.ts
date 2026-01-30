import axios from 'axios';

// Instance Axios
const api = axios.create({
  baseURL: 'http://127.0.0.1:5000', // Saran: Pake import.meta.env.VITE_API_URL
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

// Interceptor (Satpam Token)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;