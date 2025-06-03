/**
 * API Constants and Configuration
 * 
 * Central configuration for all API endpoints, keys, and settings
 * used throughout the Nutrition Tracker application.
 */

// ========================================
// BASE URLS
// ========================================

export const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000/api/v1'
  : 'https://api.nutritiontracker.dev/v1';

export const USDA_API_BASE_URL = 'https://api.nal.usda.gov/fdc/v1';
export const NUTRITIONIX_API_BASE_URL = 'https://trackapi.nutritionix.com/v2';
export const SPOONACULAR_API_BASE_URL = 'https://api.spoonacular.com';

// ========================================
// API ENDPOINTS
// ========================================

export const ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email',
  },

  // User Management
  USER: {
    PROFILE: '/user/profile',
    PREFERENCES: '/user/preferences',
    AVATAR: '/user/avatar',
    DELETE_ACCOUNT: '/user/delete',
    EXPORT_DATA: '/user/export',
  },

  // Food Data
  FOODS: {
    SEARCH: '/foods/search',
    DETAILS: '/foods/:fdcId',
    BARCODE: '/foods/barcode/:code',
    CUSTOM: '/foods/custom',
    RECENT: '/foods/recent',
    FAVORITES: '/foods/favorites',
    AUTOCOMPLETE: '/foods/autocomplete',
  },

  // Nutrition Tracking
  NUTRITION: {
    LOG: '/nutrition/log',
    DAILY: '/nutrition/daily/:date',
    WEEKLY: '/nutrition/weekly',
    MONTHLY: '/nutrition/monthly',
    BATCH_LOG: '/nutrition/log/batch',
    ENTRY: '/nutrition/log/:entryId',
    QUICK_ADD: '/nutrition/quick-add',
  },

  // Goals & Progress
  GOALS: {
    NUTRITION: '/goals/nutrition',
    WEIGHT: '/goals/weight',
    ACTIVITY: '/goals/activity',
    PROGRESS: '/goals/progress',
  },

  // Analytics
  ANALYTICS: {
    TRACK_EVENT: '/analytics/track',
    METRICS: '/analytics/metrics',
    REPORTS: '/analytics/reports',
    INSIGHTS: '/analytics/insights',
  },

  // Health Integration
  HEALTH: {
    SYNC: '/health/sync',
    DATA: '/health/data',
    PROVIDERS: '/health/providers',
    DISCONNECT: '/health/disconnect/:provider',
  },

  // Notifications
  NOTIFICATIONS: {
    REGISTER: '/notifications/register',
    PREFERENCES: '/notifications/preferences',
    SEND: '/notifications/send',
    HISTORY: '/notifications/history',
  },

  // Meal Planning
  MEALS: {
    PLANS: '/meals/plans',
    PLAN: '/meals/plans/:planId',
    RECIPES: '/meals/recipes',
    SHOPPING_LIST: '/meals/shopping-list',
    SUGGESTIONS: '/meals/suggestions',
  },
} as const;

// ========================================
// EXTERNAL API ENDPOINTS
// ========================================

export const EXTERNAL_ENDPOINTS = {
  USDA: {
    FOODS_SEARCH: '/foods/search',
    FOOD_DETAILS: '/food/:fdcId',
    FOODS_LIST: '/foods/list',
  },

  NUTRITIONIX: {
    SEARCH_INSTANT: '/search/instant',
    NUTRIENTS: '/natural/nutrients',
    EXERCISE: '/natural/exercise',
    AUTOCOMPLETE: '/search/autocomplete',
  },

  SPOONACULAR: {
    INGREDIENTS_SEARCH: '/food/ingredients/search',
    INGREDIENT_INFO: '/food/ingredients/:id/information',
    RECIPES_SEARCH: '/recipes/complexSearch',
    RECIPE_INFO: '/recipes/:id/information',
    ANALYZE_RECIPE: '/recipes/analyze',
  },
} as const;

// ========================================
// HTTP STATUS CODES
// ========================================

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  RATE_LIMITED: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

// ========================================
// API CONFIGURATION
// ========================================

export const API_CONFIG = {
  // Request timeouts (in milliseconds)
  TIMEOUT: {
    DEFAULT: 30000,      // 30 seconds
    UPLOAD: 120000,      // 2 minutes for file uploads
    DOWNLOAD: 300000,    // 5 minutes for downloads
    BARCODE_SCAN: 10000, // 10 seconds for barcode scanning
  },

  // Retry configuration
  RETRY: {
    MAX_ATTEMPTS: 3,
    DELAY: 1000,        // 1 second base delay
    BACKOFF_FACTOR: 2,  // Exponential backoff
  },

  // Cache configuration
  CACHE: {
    FOOD_SEARCH_TTL: 300000,    // 5 minutes
    FOOD_DETAILS_TTL: 3600000,  // 1 hour
    USER_PROFILE_TTL: 600000,   // 10 minutes
    NUTRITION_DATA_TTL: 60000,  // 1 minute
  },

  // Pagination
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 20,
    MAX_PAGE_SIZE: 100,
    FOOD_SEARCH_PAGE_SIZE: 25,
  },

  // Upload limits
  UPLOAD: {
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
    MAX_IMAGES_PER_REQUEST: 5,
  },
} as const;

// ========================================
// API KEYS & SECRETS
// ========================================

export const API_KEYS = {
  USDA: process.env.USDA_API_KEY || '',
  NUTRITIONIX: {
    APP_ID: process.env.NUTRITIONIX_APP_ID || '',
    API_KEY: process.env.NUTRITIONIX_API_KEY || '',
  },
  SPOONACULAR: process.env.SPOONACULAR_API_KEY || '',
  GOOGLE_CLOUD_VISION: process.env.GOOGLE_CLOUD_VISION_KEY || '',
  OPENAI: process.env.OPENAI_API_KEY || '',
} as const;

// ========================================
// ERROR CODES
// ========================================

export const ERROR_CODES = {
  // Network errors
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  CONNECTION_ERROR: 'CONNECTION_ERROR',

  // Authentication errors
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  ACCOUNT_LOCKED: 'ACCOUNT_LOCKED',
  EMAIL_NOT_VERIFIED: 'EMAIL_NOT_VERIFIED',

  // Validation errors
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_INPUT: 'INVALID_INPUT',
  MISSING_REQUIRED_FIELD: 'MISSING_REQUIRED_FIELD',

  // Resource errors
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
  RESOURCE_ALREADY_EXISTS: 'RESOURCE_ALREADY_EXISTS',
  INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',

  // Rate limiting
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  QUOTA_EXCEEDED: 'QUOTA_EXCEEDED',

  // Service errors
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  EXTERNAL_SERVICE_ERROR: 'EXTERNAL_SERVICE_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',

  // Food data specific
  FOOD_NOT_FOUND: 'FOOD_NOT_FOUND',
  BARCODE_NOT_FOUND: 'BARCODE_NOT_FOUND',
  INVALID_NUTRITION_DATA: 'INVALID_NUTRITION_DATA',
} as const;

// ========================================
// REQUEST HEADERS
// ========================================

export const HEADERS = {
  CONTENT_TYPE: 'Content-Type',
  AUTHORIZATION: 'Authorization',
  ACCEPT: 'Accept',
  USER_AGENT: 'User-Agent',
  X_API_KEY: 'X-API-Key',
  X_REQUEST_ID: 'X-Request-ID',
  X_CLIENT_VERSION: 'X-Client-Version',
  X_PLATFORM: 'X-Platform',
} as const;

export const CONTENT_TYPES = {
  JSON: 'application/json',
  FORM_DATA: 'multipart/form-data',
  URL_ENCODED: 'application/x-www-form-urlencoded',
  TEXT: 'text/plain',
} as const;

// ========================================
// API RATE LIMITS
// ========================================

export const RATE_LIMITS = {
  // Per minute limits
  FOOD_SEARCH: 60,
  BARCODE_SCAN: 30,
  NUTRITION_LOG: 120,
  IMAGE_UPLOAD: 10,

  // Per hour limits
  API_REQUESTS: 1000,
  PREMIUM_API_REQUESTS: 5000,

  // Per day limits
  EXPORT_REQUESTS: 5,
  PASSWORD_RESET: 3,
} as const;

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Build full API URL with base URL
 */
export const buildApiUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint}`;
};

/**
 * Replace path parameters in endpoint URL
 */
export const replacePathParams = (
  endpoint: string, 
  params: Record<string, string | number>
): string => {
  let url = endpoint;
  Object.entries(params).forEach(([key, value]) => {
    url = url.replace(`:${key}`, String(value));
  });
  return url;
};

/**
 * Build query string from parameters
 */
export const buildQueryString = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        value.forEach(item => searchParams.append(key, String(item)));
      } else {
        searchParams.append(key, String(value));
      }
    }
  });
  
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
};

/**
 * Check if response status indicates success
 */
export const isSuccessStatus = (status: number): boolean => {
  return status >= 200 && status < 300;
};

/**
 * Get error message for HTTP status code
 */
export const getStatusErrorMessage = (status: number): string => {
  switch (status) {
    case HTTP_STATUS.BAD_REQUEST:
      return 'Bad request - please check your input';
    case HTTP_STATUS.UNAUTHORIZED:
      return 'Authentication required - please log in';
    case HTTP_STATUS.FORBIDDEN:
      return 'Access denied - insufficient permissions';
    case HTTP_STATUS.NOT_FOUND:
      return 'Resource not found';
    case HTTP_STATUS.CONFLICT:
      return 'Resource already exists';
    case HTTP_STATUS.RATE_LIMITED:
      return 'Too many requests - please try again later';
    case HTTP_STATUS.INTERNAL_SERVER_ERROR:
      return 'Server error - please try again later';
    case HTTP_STATUS.SERVICE_UNAVAILABLE:
      return 'Service temporarily unavailable';
    default:
      return 'An unexpected error occurred';
  }
};

// ========================================
// TYPE DEFINITIONS
// ========================================

export type ApiEndpoint = typeof ENDPOINTS[keyof typeof ENDPOINTS][keyof typeof ENDPOINTS[keyof typeof ENDPOINTS]];
export type HttpStatusCode = typeof HTTP_STATUS[keyof typeof HTTP_STATUS];
export type ErrorCode = typeof ERROR_CODES[keyof typeof ERROR_CODES];
export type ContentType = typeof CONTENT_TYPES[keyof typeof CONTENT_TYPES];

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: ErrorCode;
    message: string;
    details?: any;
    timestamp: string;
    requestId?: string;
  };
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      totalItems: number;
      totalPages: number;
    };
    rateLimit?: {
      limit: number;
      remaining: number;
      reset: number;
    };
  };
}

export interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  timeout?: number;
  retries?: number;
  cache?: boolean;
  cacheTTL?: number;
} 