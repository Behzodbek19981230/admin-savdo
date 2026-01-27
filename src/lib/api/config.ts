/**
 * API Configuration
 * Bu faylda API uchun asosiy konfiguratsiyalar
 */

// API Base URL - production da o'zgartirish kerak
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.example.com';

// API Endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  auth: {
    login: '/auth/token',
    logout: '/auth/logout',
    register: '/auth/register',
    refreshToken: '/auth/token/refresh',
    me: '/user-view',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
  },
  
  // User endpoints
  users: {
    list: '/users',
    byId: (id: string) => `/users/${id}`,
    create: '/users',
    update: (id: string) => `/users/${id}`,
    delete: (id: string) => `/users/${id}`,
  },
  
  // Customer endpoints
  customers: {
    list: '/customers',
    byId: (id: string) => `/customers/${id}`,
    create: '/customers',
    update: (id: string) => `/customers/${id}`,
    delete: (id: string) => `/customers/${id}`,
    search: '/customers/search',
  },
  
  // Order endpoints
  orders: {
    list: '/orders',
    byId: (id: string) => `/orders/${id}`,
    create: '/orders',
    update: (id: string) => `/orders/${id}`,
    delete: (id: string) => `/orders/${id}`,
    recent: '/orders/recent',
  },
  
  // Product endpoints
  products: {
    list: '/products',
    byId: (id: string) => `/products/${id}`,
    create: '/products',
    update: (id: string) => `/products/${id}`,
    delete: (id: string) => `/products/${id}`,
    top: '/products/top',
  },
  
  // Analytics endpoints
  analytics: {
    dashboard: '/analytics/dashboard',
    revenue: '/analytics/revenue',
    sales: '/analytics/sales',
  },
  
  // Location endpoints
  locations: {
    countries: '/country',
    regions: '/region',
    districts: '/district',
    countryById: (id: string) => `/country/${id}`,
    regionById: (id: string) => `/region/${id}`,
    districtById: (id: string) => `/district/${id}`,
  },
} as const;

// Request timeout (milliseconds)
export const REQUEST_TIMEOUT = 30000;

// Retry configuration
export const RETRY_CONFIG = {
  maxRetries: 3,
  retryDelay: 1000,
  retryableStatusCodes: [408, 429, 500, 502, 503, 504],
};
