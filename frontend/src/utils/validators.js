// src/utils/validators.js

/**
 * Validates if a value is not empty
 * @param {*} value - Value to check
 * @returns {boolean} Whether the value is not empty
 */
export const isRequired = (value) => {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string') return value.trim().length > 0;
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'object') return Object.keys(value).length > 0;
    return true;
  };
  
  /**
   * Validates an email address format
   * @param {string} email - Email to validate
   * @returns {boolean} Whether the email is valid
   */
  export const isValidEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(String(email).toLowerCase());
  };
  
  /**
   * Validates a password meets security requirements
   * @param {string} password - Password to validate
   * @returns {Object} Validation result with success and message
   */
  export const validatePassword = (password) => {
    if (!password || password.length < 8) {
      return { success: false, message: 'Password must be at least 8 characters long' };
    }
    
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);
    
    if (!hasUppercase) {
      return { success: false, message: 'Password must contain at least one uppercase letter' };
    }
    
    if (!hasLowercase) {
      return { success: false, message: 'Password must contain at least one lowercase letter' };
    }
    
    if (!hasNumber) {
      return { success: false, message: 'Password must contain at least one number' };
    }
    
    if (!hasSpecialChar) {
      return { success: false, message: 'Password must contain at least one special character' };
    }
    
    return { success: true, message: 'Password is valid' };
  };
  
  /**
   * Validates coordinates are within valid range
   * @param {number} lat - Latitude
   * @param {number} lng - Longitude
   * @returns {boolean} Whether coordinates are valid
   */
  export const isValidCoordinates = (lat, lng) => {
    return (
      typeof lat === 'number' && 
      typeof lng === 'number' && 
      lat >= -90 && 
      lat <= 90 && 
      lng >= -180 && 
      lng <= 180
    );
  };
  
  /**
   * Validates a date is in the past
   * @param {Date|string} date - Date to validate
   * @returns {boolean} Whether the date is in the past
   */
  export const isPastDate = (date) => {
    const dateObj = date instanceof Date ? date : new Date(date);
    return dateObj < new Date();
  };
  
  /**
   * Validates a date is in the future
   * @param {Date|string} date - Date to validate
   * @returns {boolean} Whether the date is in the future
   */
  export const isFutureDate = (date) => {
    const dateObj = date instanceof Date ? date : new Date(date);
    return dateObj > new Date();
  };
  
  /**
   * Validates a date is within a specified range
   * @param {Date|string} date - Date to validate
   * @param {Date|string} startDate - Start of range
   * @param {Date|string} endDate - End of range
   * @returns {boolean} Whether the date is within range
   */
  export const isDateInRange = (date, startDate, endDate) => {
    const dateObj = date instanceof Date ? date : new Date(date);
    const startObj = startDate instanceof Date ? startDate : new Date(startDate);
    const endObj = endDate instanceof Date ? endDate : new Date(endDate);
    
    return dateObj >= startObj && dateObj <= endObj;
  };
  
  /**
   * Validates a phone number format
   * @param {string} phone - Phone number to validate
   * @returns {boolean} Whether the phone number is valid
   */
  export const isValidPhone = (phone) => {
    const cleaned = ('' + phone).replace(/\D/g, '');
    return cleaned.length >= 10 && cleaned.length <= 15;
  };
  
  /**
   * Validates a URL format
   * @param {string} url - URL to validate
   * @returns {boolean} Whether the URL is valid
   */
  export const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };
  
  /**
   * Validates a number is within a range
   * @param {number} value - Number to validate
   * @param {number} min - Minimum value
   * @param {number} max - Maximum value
   * @returns {boolean} Whether the number is within range
   */
  export const isNumberInRange = (value, min, max) => {
    return typeof value === 'number' && value >= min && value <= max;
  };
  
  /**
   * Validates a string has maximum length
   * @param {string} str - String to validate
   * @param {number} maxLength - Maximum length
   * @returns {boolean} Whether the string is valid
   */
  export const maxLength = (str, maxLength) => {
    return typeof str === 'string' && str.length <= maxLength;
  };
  
  /**
   * Validates a string has minimum length
   * @param {string} str - String to validate
   * @param {number} minLength - Minimum length
   * @returns {boolean} Whether the string is valid
   */
  export const minLength = (str, minLength) => {
    return typeof str === 'string' && str.length >= minLength;
  };
  
  /**
   * Validates a value is one of the allowed values
   * @param {*} value - Value to validate
   * @param {Array} allowedValues - Array of allowed values
   * @returns {boolean} Whether the value is allowed
   */
  export const isOneOf = (value, allowedValues) => {
    return allowedValues.includes(value);
  };
  
  /**
   * Validates an alert configuration
   * @param {Object} alert - Alert object to validate
   * @returns {Object} Validation result with errors
   */
  export const validateAlertConfig = (alert) => {
    const errors = {};
    
    if (!isRequired(alert.name)) {
      errors.name = 'Alert name is required';
    }
    
    if (!isRequired(alert.type)) {
      errors.type = 'Alert type is required';
    }
    
    if (alert.type === 'proximity' && !isValidCoordinates(alert.latitude, alert.longitude)) {
      errors.coordinates = 'Valid coordinates are required for proximity alerts';
    }
    
    if (alert.type === 'proximity' && !isNumberInRange(alert.radius, 0.1, 50)) {
      errors.radius = 'Radius must be between 0.1 and 50 miles';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };
  
  /**
   * Validates a crime report entry
   * @param {Object} report - Crime report to validate
   * @returns {Object} Validation result with errors
   */
  export const validateCrimeReport = (report) => {
    const errors = {};
    
    if (!isRequired(report.title)) {
      errors.title = 'Report title is required';
    }
    
    if (!isRequired(report.description)) {
      errors.description = 'Report description is required';
    }
    
    if (!isRequired(report.crimeType)) {
      errors.crimeType = 'Crime type is required';
    }
    
    if (!isValidCoordinates(report.latitude, report.longitude)) {
      errors.location = 'Valid location coordinates are required';
    }
    
    if (!isRequired(report.date) || !isPastDate(report.date)) {
      errors.date = 'Valid past date is required';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };
  
  /**
   * Validates a search query
   * @param {Object} query - Search query to validate
   * @returns {Object} Validation result with errors
   */
  export const validateSearchQuery = (query) => {
    const errors = {};
    
    if (query.startDate && query.endDate && new Date(query.startDate) > new Date(query.endDate)) {
      errors.dateRange = 'Start date must be before end date';
    }
    
    if (query.radius && (!query.latitude || !query.longitude)) {
      errors.location = 'Coordinates are required when specifying a radius';
    }
    
    if (query.radius && !isNumberInRange(query.radius, 0.1, 100)) {
      errors.radius = 'Radius must be between 0.1 and 100 miles';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };
  
  /**
   * Validates user registration data
   * @param {Object} userData - User data to validate
   * @returns {Object} Validation result with errors
   */
  export const validateUserRegistration = (userData) => {
    const errors = {};
    
    if (!isRequired(userData.firstName)) {
      errors.firstName = 'First name is required';
    }
    
    if (!isRequired(userData.lastName)) {
      errors.lastName = 'Last name is required';
    }
    
    if (!isRequired(userData.email) || !isValidEmail(userData.email)) {
      errors.email = 'Valid email is required';
    }
    
    const passwordValidation = validatePassword(userData.password);
    if (!passwordValidation.success) {
      errors.password = passwordValidation.message;
    }
    
    if (userData.password !== userData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };