/**
 * @fileoverview Auth context provider for managing authentication state
 */

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authApi } from '../utils/api';
import { AuthState, User } from '../types';

// Auth action types
type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'UPDATE_CREDIT_BALANCE'; payload: number };

// Initial auth state
const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: true,
  error: null
};

/**
 * Auth context for accessing auth state and actions
 */
const AuthContext = createContext<{
  state: AuthState;
  login: () => void;
  logout: () => void;
  updateUser: (user: User) => void;
  updateCreditBalance: (balance: number) => void;
  refreshUser: () => Promise<void>;
}>({
  state: initialState,
  login: () => {},
  logout: () => {},
  updateUser: () => {},
  updateCreditBalance: () => {},
  refreshUser: async () => {}
});

/**
 * Auth state reducer function
 * @param {AuthState} state - Current auth state
 * @param {AuthAction} action - Auth action
 * @returns {AuthState} New auth state
 */
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        loading: false,
        error: null
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        loading: false,
        error: action.payload
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        loading: false,
        error: null
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload
      };
    case 'UPDATE_CREDIT_BALANCE':
      return {
        ...state,
        user: state.user
          ? { ...state.user, creditBalance: action.payload }
          : null
      };
    default:
      return state;
  }
};

/**
 * Auth provider component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  /**
   * Load user on initial mount
   */
  useEffect(() => {
    const loadUser = async () => {
      try {
        dispatch({ type: 'LOGIN_START' });
        const userData = await authApi.getCurrentUser();
        dispatch({ type: 'LOGIN_SUCCESS', payload: userData });
      } catch (error) {
        dispatch({ type: 'LOGIN_FAILURE', payload: 'Not authenticated' });
      }
    };

    loadUser();
  }, []);

  /**
   * Login function - redirects to Login page
   */
  const login = () => {
    window.location.href = '/login';
  };

  /**
   * Logout function
   */
  const logout = async () => {
    try {
      await authApi.logout();
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  /**
   * Refresh user data
   */
  const refreshUser = async () => {
    try {
      const userData = await authApi.getCurrentUser();
      dispatch({ type: 'UPDATE_USER', payload: userData });
    } catch (error) {
      console.error('Refresh user error:', error);
    }
  };

  /**
   * Update user information
   * @param {User} user - Updated user data
   */
  const updateUser = (user: User) => {
    dispatch({ type: 'UPDATE_USER', payload: user });
  };

  /**
   * Update credit balance
   * @param {number} balance - New credit balance
   */
  const updateCreditBalance = (balance: number) => {
    dispatch({ type: 'UPDATE_CREDIT_BALANCE', payload: balance });
  };

  return (
    <AuthContext.Provider
      value={{
        state,
        login,
        logout,
        updateUser,
        updateCreditBalance,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to use the auth context
 * @returns {Object} Auth context value
 */
export const useAuth = () => useContext(AuthContext);

export default AuthContext; 