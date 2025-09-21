// Authentication configuration
export const AUTH_CONFIG = {
  // Google OAuth
  GOOGLE_CLIENT_ID: process.env.REACT_APP_GOOGLE_CLIENT_ID || 'your_google_client_id_here',
  
  // API endpoints
  API_BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api',
  
  // Token storage
  TOKEN_KEY: 'authToken',
  
  // Routes
  LOGIN_ROUTE: '/login',
  REGISTER_ROUTE: '/register',
  DASHBOARD_ROUTE: '/dashboard',
  RESET_PASSWORD_ROUTE: '/reset-password',
  
  // Password requirements
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_REQUIREMENTS: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: false
  }
};

// Google OAuth scopes
export const GOOGLE_SCOPES = [
  'openid',
  'profile',
  'email'
];

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    GOOGLE: '/auth/google',
    VERIFY: '/auth/verify',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    LOGOUT: '/auth/logout'
  },
  USER: {
    PROFILE: '/user/profile',
    UPDATE_PROFILE: '/user/profile',
    DELETE_ACCOUNT: '/user/account'
  }
};
