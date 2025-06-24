// API configuration
const API_BASE_URL = import.meta.env.PROD 
  ? 'https://your-production-api.com' 
  : '';

export const apiConfig = {
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
};

// API endpoints
export const endpoints = {
  auth: {
    login: '/api/v1/auth/login',
    register: '/api/v1/auth/register',
    me: '/api/v1/auth/me',
    logout: '/api/v1/auth/logout'
  },
  links: {
    list: '/api/v1/links',
    create: '/api/v1/links',
    get: (id) => `/api/v1/links/${id}`,
    update: (id) => `/api/v1/links/${id}`,
    delete: (id) => `/api/v1/links/${id}`,
    health: (id) => `/api/v1/links/${id}/health`
  }
};