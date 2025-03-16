// src/services/mapService.js
import api from './api';

const mapService = {
  // Map visualization data
  getMapData: (bounds, filters) => api.post('/crimes/map-data/', { bounds, ...filters }),
  
  // Geocoding services
  geocodeAddress: (address) => api.post('/map/geocode/', { address }),
  reverseGeocode: (lat, lng) => api.get(`/map/reverse-geocode/?lat=${lat}&lng=${lng}`),
  
  // District and boundary data
  getDistricts: () => api.get('/map/districts/'),
  getBoundaries: (type = 'all') => api.get(`/map/boundaries/?type=${type}`),
  
  // Point of interest data
  getPointsOfInterest: (category, lat, lng, radius) => 
    api.get(`/map/poi/?category=${category}&lat=${lat}&lng=${lng}&radius=${radius}`),
  
  // Saved locations
  getSavedLocations: () => api.get('/map/saved-locations/'),
  saveLocation: (locationData) => api.post('/map/saved-locations/', locationData),
  deleteSavedLocation: (id) => api.delete(`/map/saved-locations/${id}/`),
  
  // Map preferences
  getMapPreferences: () => api.get('/map/preferences/'),
  updateMapPreferences: (preferences) => api.put('/map/preferences/', preferences)
};

export default mapService;