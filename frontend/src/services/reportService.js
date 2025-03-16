// src/services/reportService.js
import api from './api';

const reportService = {
  // Report generation
  generateReport: (reportParams) => api.post('/reports/generate/', reportParams),
  downloadReport: (reportId, format = 'pdf') => 
    api.get(`/reports/${reportId}/download/?format=${format}`, { responseType: 'blob' }),
  
  // Report templates
  getReportTemplates: () => api.get('/reports/templates/'),
  getReportTemplateById: (id) => api.get(`/reports/templates/${id}/`),
  createReportTemplate: (templateData) => api.post('/reports/templates/', templateData),
  updateReportTemplate: (id, templateData) => api.put(`/reports/templates/${id}/`, templateData),
  deleteReportTemplate: (id) => api.delete(`/reports/templates/${id}/`),
  
  // Report history
  getReportHistory: (params) => api.get('/reports/history/', { params }),
  getReportById: (id) => api.get(`/reports/${id}/`),
  deleteReport: (id) => api.delete(`/reports/${id}/`),
  
  // Report sharing
  shareReport: (reportId, shareData) => api.post(`/reports/${reportId}/share/`, shareData),
  getSharedReports: () => api.get('/reports/shared/'),
  
  // Report statistics
  getReportUsageStats: () => api.get('/reports/statistics/')
};

export default reportService;