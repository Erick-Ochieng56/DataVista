// src/services/CrimeService.js
import api from './api';

const CrimeService = {
  // Basic crime data endpoints
  getAllCrimes: (params) => api.get('/crimes/', { params }),
  getCrimeById: (id) => api.get(`/crimes/${id}/`),
  searchCrimes: (searchParams) => api.post('/crimes/search/', searchParams),
  
  // Crime statistics endpoints
  getCrimeStats: (params) => api.get('/crimes/statistics/', { params }),
  getCrimeTrends: (timeframe = 'monthly') => api.get(`/crimes/trends/?timeframe=${timeframe}`),
  
  // Geographic data endpoints
  getCrimesByLocation: (lat, lng, radius) => 
    api.get(`/crimes/by-location/?lat=${lat}&lng=${lng}&radius=${radius}`),
  getHeatmapData: (params) => api.get('/crimes/heatmap/', { params }),
  getClusters: (bounds) => api.post('/crimes/clusters/', bounds),
  
  // Admin functions (if applicable)
  createCrime: (crimeData) => api.post('/crimes/', crimeData),
  updateCrime: (id, crimeData) => api.put(`/crimes/${id}/`, crimeData),
  deleteCrime: (id) => api.delete(`/crimes/${id}/`)
};

export default CrimeService;