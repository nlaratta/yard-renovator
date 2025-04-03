/**
 * @fileoverview API utility functions for communicating with the backend
 */

import axios from 'axios';
import { ApiResponse, User, CreditPackage, Transaction, ImageRequest, RenovationTheme, RenovationLevel, RenovationOptions, ProductSuggestion } from '../types';

// Create axios instance with default config
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

/**
 * Authentication API functions
 */
export const authApi = {
  /**
   * Get current user data
   * @async
   * @returns {Promise<User>} User data
   */
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<ApiResponse<{ id: number, name: string, email: string, picture: string, creditBalance: number }>>('/auth/me');
    return response.data.data!;
  },
  
  /**
   * Logout the current user
   * @async
   */
  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  }
};

/**
 * Credits API functions
 */
export const creditsApi = {
  /**
   * Get user's credit balance
   * @async
   * @returns {Promise<number>} Credit balance
   */
  getBalance: async (): Promise<number> => {
    const response = await api.get<ApiResponse<{ creditBalance: number }>>('/credits/balance');
    return response.data.data!.creditBalance;
  },
  
  /**
   * Get available credit packages
   * @async
   * @returns {Promise<CreditPackage[]>} Credit packages
   */
  getPackages: async (): Promise<CreditPackage[]> => {
    const response = await api.get<ApiResponse<{ packages: CreditPackage[] }>>('/credits/packages');
    return response.data.data!.packages;
  },
  
  /**
   * Purchase credits
   * @async
   * @param {string} packageId - Package ID to purchase
   * @returns {Promise<{ approvalUrl: string, paymentId: string }>} Payment details
   */
  purchase: async (packageId: string): Promise<{ approvalUrl: string, paymentId: string }> => {
    const response = await api.post<ApiResponse<{ approvalUrl: string, paymentId: string }>>('/credits/purchase', { packageId });
    return response.data.data!;
  },
  
  /**
   * Get user's transaction history
   * @async
   * @param {number} page - Page number
   * @param {number} limit - Results per page
   * @returns {Promise<{ transactions: Transaction[], pagination: any }>} Transaction history
   */
  getTransactions: async (page: number = 1, limit: number = 10): Promise<{ transactions: Transaction[], pagination: any }> => {
    const response = await api.get<ApiResponse<{ transactions: Transaction[], pagination: any }>>('/credits/transactions', {
      params: { page, limit }
    });
    return response.data.data!;
  }
};

/**
 * Images API functions
 */
export const imagesApi = {
  /**
   * Get available renovation themes
   * @async
   * @returns {Promise<RenovationTheme[]>} Renovation themes
   */
  getThemes: async (): Promise<RenovationTheme[]> => {
    const response = await api.get<ApiResponse<{ themes: RenovationTheme[] }>>('/images/themes');
    return response.data.data!.themes;
  },
  
  /**
   * Get available renovation levels
   * @async
   * @returns {Promise<RenovationLevel[]>} Renovation levels
   */
  getLevels: async (): Promise<RenovationLevel[]> => {
    const response = await api.get<ApiResponse<{ levels: RenovationLevel[] }>>('/images/levels');
    return response.data.data!.levels;
  },
  
  /**
   * Upload image and generate renovation
   * @async
   * @param {FormData} formData - Form data with image and options
   * @returns {Promise<{ requestId: number, estimatedTime: string }>} Request details
   */
  upload: async (formData: FormData): Promise<{ requestId: number, estimatedTime: string }> => {
    const response = await api.post<ApiResponse<{ requestId: number, estimatedTime: string }>>('/images/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data.data!;
  },
  
  /**
   * Get image generation request status and result
   * @async
   * @param {number} requestId - Request ID
   * @returns {Promise<ImageRequest>} Image request details
   */
  getRequest: async (requestId: number): Promise<ImageRequest> => {
    const response = await api.get<ApiResponse<ImageRequest>>(`/images/${requestId}`);
    return response.data.data!;
  }
};

/**
 * User API functions
 */
export const userApi = {
  /**
   * Get user profile
   * @async
   * @returns {Promise<User>} User profile
   */
  getProfile: async (): Promise<User> => {
    const response = await api.get<ApiResponse<User>>('/user/profile');
    return response.data.data!;
  },
  
  /**
   * Update user profile
   * @async
   * @param {Partial<User>} data - Updated user data
   * @returns {Promise<User>} Updated user profile
   */
  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response = await api.put<ApiResponse<User>>('/user/profile', data);
    return response.data.data!;
  },
  
  /**
   * Get user's image generation history
   * @async
   * @param {number} page - Page number
   * @param {number} limit - Results per page
   * @returns {Promise<{ requests: ImageRequest[], pagination: any }>} Image request history
   */
  getHistory: async (page: number = 1, limit: number = 10): Promise<{ requests: ImageRequest[], pagination: any }> => {
    const response = await api.get<ApiResponse<{ requests: ImageRequest[], pagination: any }>>('/user/history', {
      params: { page, limit }
    });
    return response.data.data!;
  },
  
  /**
   * Get user dashboard data
   * @async
   * @returns {Promise<{ user: User, stats: any, recentRequests: ImageRequest[] }>} Dashboard data
   */
  getDashboard: async (): Promise<{ user: User, stats: any, recentRequests: ImageRequest[] }> => {
    const response = await api.get<ApiResponse<{ user: User, stats: any, recentRequests: ImageRequest[] }>>('/user/dashboard');
    return response.data.data!;
  }
};

/**
 * Affiliate API functions
 */
export const affiliateApi = {
  /**
   * Get a specific product by ID
   * @async
   * @param {string} productId - Product ID
   * @returns {Promise<ProductSuggestion>} Product details
   */
  getProduct: async (productId: string): Promise<ProductSuggestion> => {
    const response = await api.get<ApiResponse<{ product: ProductSuggestion }>>(`/affiliate/products/${productId}`);
    return response.data.data!.product;
  },
  
  /**
   * Search products by category
   * @async
   * @param {string} category - Product category
   * @param {number} limit - Maximum number of products to return
   * @returns {Promise<ProductSuggestion[]>} Product list
   */
  searchProducts: async (category: string, limit?: number): Promise<ProductSuggestion[]> => {
    const response = await api.get<ApiResponse<{ products: ProductSuggestion[] }>>('/affiliate/products', {
      params: { category, limit }
    });
    return response.data.data!.products;
  },
  
  /**
   * Get product suggestions for image
   * @async
   * @param {number} requestId - Image request ID
   * @returns {Promise<ProductSuggestion[]>} Product suggestions
   */
  getSuggestions: async (requestId: number): Promise<ProductSuggestion[]> => {
    const response = await api.get<ApiResponse<{ suggestions: ProductSuggestion[] }>>('/affiliate/suggestions', {
      params: { requestId }
    });
    return response.data.data!.suggestions;
  }
};

// Configure axios interceptor to handle CSRF token
api.interceptors.request.use(
  async (config) => {
    try {
      const csrfResponse = await axios.get('/api/csrf-token');
      const csrfToken = csrfResponse.data.csrfToken;
      
      if (csrfToken) {
        config.headers['X-CSRF-Token'] = csrfToken;
      }
    } catch (error) {
      console.error('Error getting CSRF token:', error);
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

export default api; 