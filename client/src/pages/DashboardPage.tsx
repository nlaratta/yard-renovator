/**
 * @fileoverview Dashboard page component
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ImageRequest } from '../types';
import { createImageUrl } from '../utils/gemini';
import { userApi } from '../utils/api';

/**
 * Dashboard page component
 * @returns {JSX.Element} Dashboard page component
 */
const DashboardPage: React.FC = () => {
  const { state } = useAuth();
  const { user } = state;
  
  const [recentRenovations, setRecentRenovations] = useState<ImageRequest[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchRecentRenovations = async () => {
      try {
        const dashboardData = await userApi.getDashboard();
        setRecentRenovations(dashboardData.recentRequests);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching recent renovations:', err);
        setError('Failed to load recent renovations');
        setIsLoading(false);
      }
    };
    
    fetchRecentRenovations();
  }, []);
  
  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-secondary-600">Loading user information...</p>
      </div>
    );
  }
  
  return (
    <div>
      <h1 className="text-3xl font-bold text-secondary-800 mb-6">Dashboard</h1>
      
      {/* User stats section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-secondary-700 mb-2">Your Credits</h2>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <svg className="h-10 w-10 text-primary-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-3xl font-bold text-secondary-800">{user.creditBalance}</span>
            </div>
            {user.creditBalance < 1 ? (
              <Link to="/pricing" className="btn-primary text-sm">
                Buy Credits
              </Link>
            ) : (
              <Link to="/renovate" className="btn-accent text-sm">
                Create New
              </Link>
            )}
          </div>
        </div>
        
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-secondary-700 mb-2">Renovations</h2>
          <div className="flex items-center">
            <svg className="h-10 w-10 text-primary-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-3xl font-bold text-secondary-800">{recentRenovations.length}</span>
          </div>
        </div>
        
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-secondary-700 mb-2">Account</h2>
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-primary-100 text-primary-800 flex items-center justify-center mr-3">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <p className="font-medium text-secondary-800">{user.name || 'User'}</p>
              <p className="text-sm text-secondary-600">{user.email || 'user@example.com'}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Link to="/renovate" className={`card p-6 hover:shadow-md transition-shadow ${user.creditBalance < 1 ? 'opacity-50 pointer-events-none' : ''}`}>
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center mr-4">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-secondary-800">Create New Renovation</h3>
              <p className="text-secondary-600">Upload a yard photo and transform it</p>
            </div>
          </div>
        </Link>
        
        <Link to="/my-renovations" className="card p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center mr-4">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-secondary-800">View All Renovations</h3>
              <p className="text-secondary-600">Browse your renovation history</p>
            </div>
          </div>
        </Link>
      </div>
      
      {/* Recent renovations */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-secondary-700">Recent Renovations</h2>
          <Link to="/my-renovations" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            View All
          </Link>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center my-12">
            <div className="spinner"></div>
          </div>
        ) : error ? (
          <div className="card p-6 text-center">
            <p className="text-secondary-600">{error}</p>
          </div>
        ) : recentRenovations.length === 0 ? (
          <div className="card p-6 text-center">
            <svg className="h-16 w-16 text-secondary-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="text-lg font-semibold text-secondary-700 mb-2">No Renovations Yet</h3>
            <p className="text-secondary-600 mb-4">
              You haven't created any yard renovations yet. Get started with your first one!
            </p>
            <Link to="/renovate" className={`btn-primary inline-block ${user.creditBalance < 1 ? 'opacity-50 pointer-events-none' : ''}`}>
              Create Your First Renovation
            </Link>
            {user.creditBalance < 1 && (
              <div className="mt-4 text-sm text-secondary-500">
                You need at least 1 credit to create a renovation. <Link to="/pricing" className="text-primary-600 hover:underline">Buy credits</Link>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentRenovations.map((renovation) => (
              <Link 
                key={renovation.requestId} 
                to={`/result/${renovation.requestId}`}
                className="card overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="aspect-w-16 aspect-h-9 bg-secondary-100">
                  {renovation.generatedImageUrl ? (
                    <img 
                      src={createImageUrl(renovation.generatedImageUrl)} 
                      alt="Renovated yard" 
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <svg className="h-12 w-12 text-secondary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-secondary-800">
                      {renovation.renovationOptions?.theme || 'Renovation'}
                    </h3>
                    <span className="text-xs text-secondary-500">
                      {new Date(renovation.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-secondary-600">
                    {renovation.status === 'completed'
                      ? 'Completed'
                      : renovation.status === 'processing'
                      ? 'Processing...'
                      : 'Failed'}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      
      {/* Tips and suggestions */}
      <div className="card p-6 bg-primary-50 border border-primary-100">
        <h2 className="text-xl font-semibold text-secondary-800 mb-4">Tips for Great Renovations</h2>
        <ul className="space-y-3 text-secondary-700">
          <li className="flex items-start">
            <svg className="h-5 w-5 text-primary-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Take photos in good lighting, preferably on a clear day</span>
          </li>
          <li className="flex items-start">
            <svg className="h-5 w-5 text-primary-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Capture a wide view of the yard to include all areas for renovation</span>
          </li>
          <li className="flex items-start">
            <svg className="h-5 w-5 text-primary-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Try different themes to see various styles for your space</span>
          </li>
          <li className="flex items-start">
            <svg className="h-5 w-5 text-primary-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Add detailed notes about specific features you want included</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DashboardPage; 