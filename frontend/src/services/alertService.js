// src/services/alertService.js
import api from './api';

const alertService = {
  // Alert CRUD operations
  getAllAlerts: (params) => api.get('/alerts/', { params }),
  getAlertById: (id) => api.get(`/alerts/${id}/`),
  createAlert: (alertData) => api.post('/alerts/', alertData),
  updateAlert: (id, alertData) => api.put(`/alerts/${id}/`, alertData),
  deleteAlert: (id) => api.delete(`/alerts/${id}/`),
  
  // Alert specific functions
  toggleAlertActive: (id, isActive) => api.patch(`/alerts/${id}/toggle/`, { active: isActive }),
  getUserAlerts: () => api.get('/alerts/user/'),
  getRecentAlerts: () => api.get('/alerts/recent/'),
  
  // Alert notifications
  getNotifications: () => api.get('/alerts/notifications/'),
  markNotificationAsRead: (notificationId) => 
    api.patch(`/alerts/notifications/${notificationId}/read/`),
  
  // Alert statistics
  getAlertStats: () => api.get('/alerts/statistics/')
};

export default alertService;