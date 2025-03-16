// src/services/analyticsService.js
import api from './api';

const analyticsService = {
  // Time series analysis
  getTimeSeriesData: (params) => api.get('/analytics/time-series/', { params }),
  forecastTimeSeries: (params) => api.post('/analytics/time-series/forecast/', params),
  
  // Predictive analysis
  getPredictiveAnalysis: (params) => api.post('/analytics/predict/', params),
  getHotspotPrediction: (params) => api.post('/analytics/hotspots/', params),
  
  // Pattern detection
  detectPatterns: (params) => api.post('/analytics/patterns/', params),
  getSimilarCrimes: (crimeId, params) => api.get(`/analytics/similar/${crimeId}/`, { params }),
  
  // Custom analysis
  runCustomAnalysis: (analysisConfig) => api.post('/analytics/custom/', analysisConfig),
  
  // Analytics models
  getAvailableModels: () => api.get('/analytics/models/'),
  getModelDetails: (modelId) => api.get(`/analytics/models/${modelId}/`),
  trainModel: (modelConfig) => api.post('/analytics/models/train/', modelConfig),
  evaluateModel: (modelId, testParams) => api.post(`/analytics/models/${modelId}/evaluate/`, testParams),
  
  // Analysis history
  getAnalysisHistory: () => api.get('/analytics/history/'),
  getAnalysisById: (id) => api.get(`/analytics/history/${id}/`),
  
  // Insights
  getInsights: (params) => api.get('/analytics/insights/', { params }),
  
  // Export analysis results
  exportAnalysisResults: (analysisId, format = 'json') => 
    api.get(`/analytics/export/${analysisId}/?format=${format}`, { responseType: 'blob' })
};

export default analyticsService;