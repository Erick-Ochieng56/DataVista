// src/services/auth.js
import api from './api';

const authService = {
  // Authentication
  login: (credentials) => api.post('/accounts/login/', credentials),
  register: (userData) => api.post('/accounts/register/', userData),
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    return Promise.resolve();
  },
  
  // Password management
  resetPassword: (email) => api.post('/accounts/reset-password/', { email }),
  confirmResetPassword: (token, newPassword) => 
    api.post('/accounts/reset-password/confirm/', { token, new_password: newPassword }),
  changePassword: (oldPassword, newPassword) => 
    api.post('/accounts/change-password/', { old_password: oldPassword, new_password: newPassword }),
  
  // User profile
  getUserProfile: () => api.get('/accounts/profile/'),
  updateUserProfile: (profileData) => api.patch('/accounts/profile/', profileData),
  
  // Verification
  verifyEmail: (token) => api.post('/accounts/verify-email/', { token }),
  resendVerification: (email) => api.post('/accounts/resend-verification/', { email }),
  
  // Session management
  refreshToken: (refreshToken) => api.post('/accounts/token/refresh/', { refresh: refreshToken }),
  verifyToken: (token) => api.post('/accounts/token/verify/', { token }),
  
  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('authToken');
    return !!token;
  }
};

export default authService;