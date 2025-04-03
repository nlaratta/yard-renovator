/**
 * @fileoverview Protected route component for authenticated routes
 * Redirects to login if user is not authenticated
 */

import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Protected route props
 * @interface ProtectedRouteProps
 */
interface ProtectedRouteProps {
  /**
   * Minimum credit balance required to access the route
   */
  requiredCredits?: number;
}

/**
 * Protected route component
 * Ensures that the user is authenticated to access the route
 * Optionally checks if the user has sufficient credits
 * @param {ProtectedRouteProps} props - Component props
 * @returns {JSX.Element} Protected route component
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredCredits = 0 }) => {
  const { state } = useAuth();
  const { isAuthenticated, user, loading } = state;
  const location = useLocation();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated || !user) {
    // Redirect to login page with the current location for redirect after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If insufficient credits, redirect to pricing page
  if (requiredCredits > 0 && user.creditBalance < requiredCredits) {
    return <Navigate to="/pricing" state={{ from: location, requiredCredits }} replace />;
  }

  // If authenticated (and has sufficient credits if required), render the route
  return <Outlet />;
};

export default ProtectedRoute; 