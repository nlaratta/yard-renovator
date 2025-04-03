/**
 * @fileoverview Login page component
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Login page component
 * @returns {JSX.Element} Login page component
 */
const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useAuth();

  // Redirect if already logged in
  React.useEffect(() => {
    if (state.isAuthenticated) {
      navigate('/dashboard');
    }
  }, [state.isAuthenticated, navigate]);

  return (
    <div className="max-w-lg mx-auto my-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-secondary-800 mb-4">Sign In to Yard Renovator</h1>
        <p className="text-secondary-600">
          Start creating beautiful AI-powered yard renovations
        </p>
      </div>

      <div className="card p-8">
        <a 
          href={`${process.env.REACT_APP_API_URL}/auth/google`}
          className="flex items-center justify-center gap-3 w-full p-3 border border-secondary-300 rounded-md hover:bg-secondary-50 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path 
              fill="#4285F4" 
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" 
            />
            <path 
              fill="#34A853" 
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" 
            />
            <path 
              fill="#FBBC05" 
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" 
            />
            <path 
              fill="#EA4335" 
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" 
            />
          </svg>
          Sign in with Google
        </a>

        <div className="mt-6 text-center text-sm text-secondary-500">
          By signing in, you agree to our <a href="/terms" className="text-primary-600 hover:underline">Terms of Service</a> and <a href="/privacy" className="text-primary-600 hover:underline">Privacy Policy</a>.
        </div>
      </div>

      <div className="mt-8 text-center">
        <h2 className="text-xl font-semibold text-secondary-800 mb-4">Why Sign In?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card p-4">
            <svg className="h-8 w-8 text-primary-600 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <h3 className="font-semibold text-secondary-700">Create Renovations</h3>
            <p className="text-sm text-secondary-600">Upload your yard photos and create AI renovations</p>
          </div>
          <div className="card p-4">
            <svg className="h-8 w-8 text-primary-600 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h3 className="font-semibold text-secondary-700">Save Projects</h3>
            <p className="text-sm text-secondary-600">Access your renovation history anytime</p>
          </div>
          <div className="card p-4">
            <svg className="h-8 w-8 text-primary-600 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            <h3 className="font-semibold text-secondary-700">Buy Credits</h3>
            <p className="text-sm text-secondary-600">Purchase credits to generate more renovations</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 