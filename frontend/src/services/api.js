// src/services/api.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Crime data services
export const crimeService = {
  getCrimes: (params) => api.get('/crimes/', { params }),
  getCrimeDetails: (id) => api.get(`/crimes/${id}/`),
  searchCrimes: (searchParams) => api.post('/crimes/search/', searchParams),
};

// Authentication services
export const authService = {
  login: (credentials) => api.post('/accounts/login/', credentials),
  register: (userData) => api.post('/accounts/register/', userData),
  resetPassword: (email) => api.post('/accounts/reset-password/', { email }),
};

// Alert services
export const alertService = {
  createAlert: (alertData) => api.post('/alerts/', alertData),
  getUserAlerts: () => api.get('/alerts/'),
  deleteAlert: (id) => api.delete(`/alerts/${id}/`),
};

export default api;