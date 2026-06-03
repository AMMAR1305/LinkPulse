// src/services/api.js
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Request interceptor – attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor – handle auth errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      const url = error.config?.url || '';
      const isAuthEndpoint = url.includes('/auth/login') || url.includes('/auth/2fa/login-verify') || url.includes('/auth/register');

      if (status === 401) {
        if (!isAuthEndpoint) {
          // Token invalid/expired – clear and redirect to login
          localStorage.removeItem('access_token');
          toast.error('Session expired. Please log in again.');
          // navigate programmatically – we cannot use hook here, so fallback to window location
          window.location.href = '/login';
        }
      } else if (!isAuthEndpoint) {
        const message = data?.message || 'An error occurred';
        toast.error(message);
      }
    } else {
      toast.error('Network error');
    }
    return Promise.reject(error);
  }
);

export default api;
