// src/utils/helpers.js
import { ALERT_PROXIMITY } from './constants';

/**
 * Generate a unique ID
 * @returns {string} A unique ID
 */
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

/**
 * Group an array of objects by a specified key
 * @param {Array} array - The array to group
 * @param {string} key - The key to group by
 * @returns {Object} Grouped objects
 */
export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    (result[item[key]] = result[item[key]] || []).push(item);
    return result;
  }, {});
};

/**
 * Calculate the center point of multiple coordinates
 * @param {Array} coordinates - Array of [lat, lng] coordinates
 * @returns {Array} Center point as [lat, lng]
 */
export const calculateCenter = (coordinates) => {
  if (!coordinates || coordinates.length === 0) return null;
  
  const sumLat = coordinates.reduce((sum, coord) => sum + coord[0], 0);
  const sumLng = coordinates.reduce((sum, coord) => sum + coord[1], 0);
  
  return [sumLat / coordinates.length, sumLng / coordinates.length];
};

/**
 * Calculate the distance between two points in miles
 * @param {number} lat1 - Latitude of first point
 * @param {number} lng1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lng2 - Longitude of second point
 * @returns {number} Distance in miles
 */
export const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 3958.8; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

/**
 * Check if a point is within a specified radius of another point
 * @param {number} lat1 - Latitude of first point
 * @param {number} lng1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lng2 - Longitude of second point
 * @param {number} radius - Radius in miles
 * @returns {boolean} Whether the second point is within the radius
 */
export const isWithinRadius = (lat1, lng1, lat2, lng2, radius = ALERT_PROXIMITY) => {
    const distance = calculateDistance(lat1, lng1, lat2, lng2);
    return distance <= radius;
  };
  
  /**
   * Format date to locale string with customizable options
   * @param {Date|string} date - Date to format
   * @param {Object} options - Intl.DateTimeFormat options
   * @returns {string} Formatted date string
   */
  export const formatDate = (date, options = {}) => {
    const defaultOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    
    const dateObj = date instanceof Date ? date : new Date(date);
    return dateObj.toLocaleDateString(undefined, { ...defaultOptions, ...options });
  };
  
  /**
   * Truncate text to a specified length
   * @param {string} text - Text to truncate
   * @param {number} length - Maximum length
   * @returns {string} Truncated text
   */
  export const truncateText = (text, length = 100) => {
    if (!text) return '';
    return text.length > length ? `${text.substring(0, length)}...` : text;
  };
  
  /**
   * Filter array by search term across multiple fields
   * @param {Array} array - Array to filter
   * @param {string} searchTerm - Term to search for
   * @param {Array} fields - Fields to search in
   * @returns {Array} Filtered array
   */
  export const filterBySearchTerm = (array, searchTerm, fields) => {
    if (!searchTerm || !array?.length) return array;
    
    const term = searchTerm.toLowerCase();
    return array.filter(item => {
      return fields.some(field => {
        const value = item[field];
        return value && String(value).toLowerCase().includes(term);
      });
    });
  };
  
  /**
   * Sort array of objects by a specified key
   * @param {Array} array - Array to sort
   * @param {string} key - Key to sort by
   * @param {string} direction - Sort direction ('asc' or 'desc')
   * @returns {Array} Sorted array
   */
  export const sortByKey = (array, key, direction = 'asc') => {
    if (!array?.length) return array;
    
    return [...array].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  };
  
  /**
   * Debounce function to limit execution rate
   * @param {Function} func - Function to debounce
   * @param {number} wait - Wait time in milliseconds
   * @returns {Function} Debounced function
   */
  export const debounce = (func, wait = 300) => {
    let timeout;
    
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };
  
  /**
   * Deep clone an object
   * @param {Object} obj - Object to clone
   * @returns {Object} Cloned object
   */
  export const deepClone = (obj) => {
    if (obj === null || typeof obj !== 'object') return obj;
    return JSON.parse(JSON.stringify(obj));
  };
  
  /**
   * Extract query parameters from URL
   * @returns {Object} Object with query parameters
   */
  export const getQueryParams = () => {
    const params = new URLSearchParams(window.location.search);
    const result = {};
    
    for (const [key, value] of params.entries()) {
      result[key] = value;
    }
    
    return result;
  };