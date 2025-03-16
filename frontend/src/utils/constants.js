// src/utils/constants.js

// API endpoints
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// Crime types
export const CRIME_TYPES = {
  THEFT: 'theft',
  ROBBERY: 'robbery',
  ASSAULT: 'assault',
  BURGLARY: 'burglary',
  HOMICIDE: 'homicide',
  VEHICLE_THEFT: 'vehicle_theft',
  VANDALISM: 'vandalism',
  FRAUD: 'fraud',
  DRUG_OFFENSE: 'drug_offense',
  OTHER: 'other'
};

// Crime type labels for display
export const CRIME_TYPE_LABELS = {
  [CRIME_TYPES.THEFT]: 'Theft',
  [CRIME_TYPES.ROBBERY]: 'Robbery',
  [CRIME_TYPES.ASSAULT]: 'Assault',
  [CRIME_TYPES.BURGLARY]: 'Burglary',
  [CRIME_TYPES.HOMICIDE]: 'Homicide',
  [CRIME_TYPES.VEHICLE_THEFT]: 'Vehicle Theft',
  [CRIME_TYPES.VANDALISM]: 'Vandalism',
  [CRIME_TYPES.FRAUD]: 'Fraud',
  [CRIME_TYPES.DRUG_OFFENSE]: 'Drug Offense',
  [CRIME_TYPES.OTHER]: 'Other'
};

// Crime status
export const CRIME_STATUS = {
  REPORTED: 'reported',
  UNDER_INVESTIGATION: 'under_investigation',
  CLOSED: 'closed',
  RESOLVED: 'resolved'
};

// Map settings
export const MAP_SETTINGS = {
  DEFAULT_CENTER: [39.8283, -98.5795], // Center of the US
  DEFAULT_ZOOM: 4,
  MARKER_CLUSTER_RADIUS: 60,
  HEATMAP_RADIUS: 30,
  HEATMAP_BLUR: 15,
  DEFAULT_BOUNDS: [
    [24.396308, -125.000000], // Southwest
    [49.384358, -66.934570]   // Northeast
  ]
};

// Time periods for reports and analytics
export const TIME_PERIODS = {
  LAST_24_HOURS: 'last_24_hours',
  LAST_7_DAYS: 'last_7_days',
  LAST_30_DAYS: 'last_30_days',
  LAST_90_DAYS: 'last_90_days',
  LAST_YEAR: 'last_year',
  CUSTOM: 'custom'
};

// Report types
export const REPORT_TYPES = {
  CRIME_SUMMARY: 'crime_summary',
  CRIME_TRENDS: 'crime_trends',
  LOCATION_ANALYSIS: 'location_analysis',
  PREDICTIVE_ANALYSIS: 'predictive_analysis',
  CUSTOM: 'custom'
};

// Report formats
export const REPORT_FORMATS = {
  PDF: 'pdf',
  EXCEL: 'excel',
  CSV: 'csv'
};

// Alert frequency
export const ALERT_FREQUENCY = {
  INSTANT: 'instant',
  DAILY: 'daily',
  WEEKLY: 'weekly'
};

// Alert proximity (in miles)
export const ALERT_PROXIMITY = {
  QUARTER_MILE: 0.25,
  HALF_MILE: 0.5,
  ONE_MILE: 1,
  TWO_MILES: 2,
  FIVE_MILES: 5,
  TEN_MILES: 10
};

// User roles
export const USER_ROLES = {
  ADMIN: 'admin',
  ANALYST: 'analyst',
  OFFICER: 'officer',
  SUPERVISOR: 'supervisor',
  CIVILIAN: 'civilian'
};

// Chart colors
export const CHART_COLORS = {
  PRIMARY: '#4f46e5', // indigo-600
  SECONDARY: '#0ea5e9', // sky-500
  DANGER: '#ef4444', // red-500
  SUCCESS: '#22c55e', // green-500
  WARNING: '#eab308', // yellow-500
  INFO: '#3b82f6', // blue-500
  GRAY: '#6b7280', // gray-500
  LIGHT: '#f3f4f6', // gray-100
  DARK: '#1f2937', // gray-800
};

// Pagination
export const PAGINATION = {
  DEFAULT_LIMIT: 10,
  OPTIONS: [10, 25, 50, 100]
};

// Search radius options (in miles)
export const SEARCH_RADIUS_OPTIONS = [0.25, 0.5, 1, 2, 5, 10, 25];

// Day of week
export const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Months
export const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];