/**
 * @fileoverview Profile page component
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Profile page component
 * @returns {JSX.Element} Profile page component
 */
const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { state, logout } = useAuth();
  const { user } = state;
  
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
  
  /**
   * Handle logout
   */
  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
      setIsLoggingOut(false);
    }
  };
  
  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-secondary-600">Loading user information...</p>
      </div>
    );
  }
  
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-secondary-800 mb-6">Your Profile</h1>
      
      <div className="card mb-8">
        <div className="p-6 border-b border-secondary-200">
          <h2 className="text-xl font-semibold text-secondary-700 mb-4">Account Information</h2>
          
          <div className="flex items-center mb-6">
            <div className="h-16 w-16 rounded-full bg-primary-100 text-primary-800 flex items-center justify-center text-xl font-bold mr-4">
              {user.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <h3 className="text-lg font-medium text-secondary-800">{user.name || 'User'}</h3>
              <p className="text-secondary-600">{user.email || 'user@example.com'}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-secondary-500">Account Type</p>
              <p className="font-medium text-secondary-800">Google Account</p>
            </div>
            <div>
              <p className="text-sm text-secondary-500">Member Since</p>
              <p className="font-medium text-secondary-800">
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-secondary-500">Credit Balance</p>
              <p className="font-medium text-secondary-800">
                {user.creditBalance} credits
                <Link to="/pricing" className="ml-2 text-sm text-primary-600 hover:underline">
                  Buy More
                </Link>
              </p>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <h2 className="text-xl font-semibold text-secondary-700 mb-4">Account Actions</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-secondary-50 rounded-md">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-secondary-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h3 className="font-medium text-secondary-800">Credits & Billing</h3>
                  <p className="text-sm text-secondary-600">Manage your credits and view purchase history</p>
                </div>
              </div>
              <Link to="/pricing" className="text-primary-600 hover:text-primary-700">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-secondary-50 rounded-md">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-secondary-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div>
                  <h3 className="font-medium text-secondary-800">My Renovations</h3>
                  <p className="text-sm text-secondary-600">View your renovation history</p>
                </div>
              </div>
              <Link to="/my-renovations" className="text-primary-600 hover:text-primary-700">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-secondary-50 rounded-md">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-secondary-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h3 className="font-medium text-secondary-800">Help & Support</h3>
                  <p className="text-sm text-secondary-600">Get help with using the service</p>
                </div>
              </div>
              <Link to="/faqs" className="text-primary-600 hover:text-primary-700">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            
            <button 
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex w-full items-center justify-between p-3 bg-red-50 text-left rounded-md hover:bg-red-100"
            >
              <div className="flex items-center">
                <svg className="h-5 w-5 text-red-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <div>
                  <h3 className="font-medium text-red-800">Sign Out</h3>
                  <p className="text-sm text-red-600">Log out of your account</p>
                </div>
              </div>
              {isLoggingOut ? (
                <div className="spinner-sm border-red-600"></div>
              ) : (
                <svg className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      
      <div className="card mb-8">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-secondary-700 mb-4">Privacy & Data</h2>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <svg className="h-5 w-5 text-secondary-600 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <div>
                <h3 className="font-medium text-secondary-800">Data Privacy</h3>
                <p className="text-sm text-secondary-600 mb-2">
                  We take your privacy seriously. Your data is only used to provide the service and is never shared with third parties without your consent.
                </p>
                <Link to="/privacy" className="text-sm text-primary-600 hover:underline">
                  Read our Privacy Policy
                </Link>
              </div>
            </div>
            
            <div className="flex items-start">
              <svg className="h-5 w-5 text-secondary-600 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              <div>
                <h3 className="font-medium text-secondary-800">Your Uploads</h3>
                <p className="text-sm text-secondary-600">
                  Images you upload are stored securely and used solely for generating your yard renovations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="text-center text-sm text-secondary-500 mb-8">
        <p>&copy; {new Date().getFullYear()} Yard Renovator. All rights reserved.</p>
        <div className="flex justify-center gap-4 mt-2">
          <Link to="/terms" className="hover:text-secondary-800">Terms of Service</Link>
          <Link to="/privacy" className="hover:text-secondary-800">Privacy Policy</Link>
          <Link to="/about" className="hover:text-secondary-800">About</Link>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 