// src/utils/formatters.js
import { CRIME_TYPE_LABELS, DAYS_OF_WEEK, MONTHS } from './constants';

/**
 * Format a date as YYYY-MM-DD
 * @param {Date} date - The date to format
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};

/**
 * Format a date with time as YYYY-MM-DD HH:MM
 * @param {Date} date - The date to format
 * @returns {string} Formatted datetime string
 */
export const formatDateTime = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return `${formatDate(d)} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
};

/**
 * Format a date in a human-readable format
 * @param {Date} date - The date to format
 * @returns {string} Formatted date like "January 1, 2023"
 */
export const formatReadableDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
};

/**
 * Format a time in 12-hour format
 * @param {Date} date - The date to format
 * @returns {string} Formatted time like "3:45 PM"
 */
export const formatTime = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
};

/**
 * Format a day of the week from a date
 * @param {Date} date - The date to get the day from
 * @returns {string} Day of the week (e.g., "Monday")
 */
export const formatDayOfWeek = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return DAYS_OF_WEEK[d.getDay()];
};

/**
 * Format a number as currency
 * @param {number} value - The number to format
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (value) => {
  if (value === null || value === undefined) return '';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(value);
};

/**
 * Format a number with commas for thousands
 * @param {number} value - The number to format
 * @returns {string} Formatted number with commas
 */
export const formatNumber = (value) => {
  if (value === null || value === undefined) return '';
  return new Intl.NumberFormat('en-US').format(value);
};

/**
 * Format a percentage
 * @param {number} value - The decimal value to format (e.g., 0.145)
 * @param {number} decimals - The number of decimal places
 * @returns {string} Formatted percentage (e.g., "14.5%")
 */
export const formatPercentage = (value, decimals = 1) => {
  if (value === null || value === undefined) return '';
  return `${(value * 100).toFixed(decimals)}%`;
};

/**
 * Format a crime type using labels
 * @param {string} type - The crime type key
 * @returns {string} The formatted crime type label
 */
export const formatCrimeType = (type) => {
  return CRIME_TYPE_LABELS[type] || type;
};

/**
 * Format a phone number as (XXX) XXX-XXXX
 * @param {string} phone - The phone number to format
 * @returns {string} Formatted phone number
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  // Remove non-digits
  const cleaned = phone.replace(/\D/g, '');
  // Check if the number is valid
  if (cleaned.length !== 10) return phone;
  // Format as (XXX) XXX-XXXX
  return `(${cleaned.substring(0, 3)}) ${cleaned.substring(3, 6)}-${cleaned.substring(6, 10)}`;
};

/**
 * Format a file size in bytes to human-readable format
 * @param {number} bytes - The size in bytes
 * @returns {string} Formatted size (e.g., "2.5 MB")
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Format a distance in miles
 * @param {number} miles - The distance in miles
 * @returns {string} Formatted distance (e.g., "2.5 miles")
 */
export const formatDistance = (miles) => {
  if (miles === null || miles === undefined) return '';
  const rounded = Math.round(miles * 100) / 100;
  return `${rounded} ${rounded === 1 ? 'mile' : 'miles'}`;
};

/**
 * Format an address
 * @param {object} address - The address object
 * @returns {string} Formatted address
 */
export const formatAddress = (address) => {
  if (!address) return '';
  const parts = [
    address.street,
    address.city,
    address.state,
    address.zip
  ].filter(Boolean);
  return parts.join(', ');
};

/**
 * Format coordinates as latitude, longitude
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {string} Formatted coordinates
 */
export const formatCoordinates = (lat, lng) => {
  if (lat === undefined || lng === undefined) return '';
  return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
};

/**
 * Format a relative time (e.g., "2 days ago")
 * @param {Date|string} date - The date to format
 * @returns {string} Relative time string
 */
export const formatRelativeTime = (date) => {
  if (!date) return '';
  const now = new Date();
  const past = new Date(date);
  const diffMs = now - past;
  const diffSec = Math.round(diffMs / 1000);
  const diffMin = Math.round(diffSec / 60);
  const diffHr = Math.round(diffMin / 60);
  const diffDays = Math.round(diffHr / 24);
  
  if (diffSec < 60)
    return `${diffSec} second${diffSec !== 1 ? 's' : ''} ago`;
  if (diffMin < 60)
    return `${diffMin} minute${diffMin !== 1 ? 's' : ''} ago`;
  if (diffHr < 24)
    return `${diffHr} hour${diffHr !== 1 ? 's' : ''} ago`;
  if (diffDays < 30)
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  
  // Fall back to regular date format
  return formatReadableDate(date);
};