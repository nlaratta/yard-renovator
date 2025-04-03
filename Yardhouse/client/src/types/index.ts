/**
 * @fileoverview Type definitions for the Yard Renovator application
 */

/**
 * User type definition
 * @interface User
 */
export interface User {
  id: number;
  name: string;
  email: string;
  picture: string;
  creditBalance: number;
  createdAt?: string;
}

/**
 * Auth context state type definition
 * @interface AuthState
 */
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

/**
 * Credit package type definition
 * @interface CreditPackage
 */
export interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  amount: number;
}

/**
 * Transaction type definition
 * @interface Transaction
 */
export interface Transaction {
  transactionId: number;
  userId: number;
  amount: number;
  creditsPurchased: number;
  paymentProvider: string;
  paymentId: string;
  status: string;
  timestamp: string;
}

/**
 * Renovation theme type definition
 * @interface RenovationTheme
 */
export interface RenovationTheme {
  id: string;
  name: string;
  description: string;
}

/**
 * Renovation level type definition
 * @interface RenovationLevel
 */
export interface RenovationLevel {
  id: string;
  name: string;
  description: string;
}

/**
 * Renovation options type definition
 * @interface RenovationOptions
 */
export interface RenovationOptions {
  theme: string;
  level: string;
  notes?: string;
}

/**
 * Image request type definition
 * @interface ImageRequest
 */
export interface ImageRequest {
  requestId: number;
  userId: number;
  renovationOptions: RenovationOptions;
  generatedImageUrl: string | null;
  affiliateLinks: ProductSuggestion[] | null;
  status: 'processing' | 'completed' | 'failed';
  createdAt: string;
  completedAt: string | null;
}

/**
 * Product data type definition
 * @interface ProductData
 */
export interface ProductData {
  title: string;
  description: string;
  price: string;
  imageUrl: string;
  rating: number;
  reviewCount: number;
}

/**
 * Product suggestion type definition
 * @interface ProductSuggestion
 */
export interface ProductSuggestion {
  productId: string;
  affiliateLink: string;
  productData: ProductData;
}

/**
 * API Response type definition
 * @interface ApiResponse
 */
export interface ApiResponse<T> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
  errors?: Array<{
    value: string;
    msg: string;
    param: string;
    location: string;
  }>;
} 