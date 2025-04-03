/**
 * @fileoverview My Renovations page component
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ImageRequest } from '../types';
import { createImageUrl } from '../utils/gemini';
import { userApi } from '../utils/api';

/**
 * My Renovations page component
 * @returns {JSX.Element} My Renovations page component
 */
const MyRenovationsPage: React.FC = () => {
  const { state } = useAuth();
  const { user } = state;
  
  const [renovations, setRenovations] = useState<ImageRequest[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [itemsPerPage] = useState<number>(9);
  
  useEffect(() => {
    const fetchRenovations = async () => {
      try {
        setIsLoading(true);
        const response = await userApi.getHistory(currentPage, itemsPerPage);
        setRenovations(response.requests);
        setTotalPages(Math.ceil(response.pagination.total / itemsPerPage));
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching renovations:', err);
        setError('Failed to load your renovations');
        setIsLoading(false);
      }
    };
    
    fetchRenovations();
  }, [currentPage, itemsPerPage]);
  
  /**
   * Filter renovations based on status
   * @returns {ImageRequest[]} Filtered renovations
   */
  const getFilteredRenovations = (): ImageRequest[] => {
    if (filter === 'all') {
      return renovations;
    }
    
    return renovations.filter(renovation => renovation.status === filter);
  };
  
  const filteredRenovations = getFilteredRenovations();
  
  // Handle page navigation
  const goToPage = (page: number) => {
    setCurrentPage(page);
  };
  
  return (
    <div className="min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-secondary-800">My Renovations</h1>
        <Link 
          to="/renovate" 
          className={`btn-primary ${user?.creditBalance && user.creditBalance > 0 ? '' : 'opacity-50 pointer-events-none'}`}
        >
          New Renovation
        </Link>
      </div>
      
      {user?.creditBalance && user.creditBalance < 1 && (
        <div className="card p-4 mb-6 bg-amber-50 border border-amber-200 text-amber-800">
          <div className="flex items-start">
            <svg className="h-5 w-5 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p className="font-medium">You have no credits remaining</p>
              <p className="text-sm mt-1">Purchase credits to create new renovations</p>
              <Link to="/pricing" className="text-sm font-medium underline hover:text-amber-900 mt-2 inline-block">
                Buy Credits
              </Link>
            </div>
          </div>
        </div>
      )}
      
      {/* Filter options - made consistent with fixed width buttons */}
      <div className="flex flex-wrap mb-6 gap-2">
        <button 
          className={`px-4 py-2 rounded-md text-sm font-medium min-w-[80px] ${
            filter === 'all' 
              ? 'bg-primary-100 text-primary-800 border border-primary-200' 
              : 'bg-secondary-100 text-secondary-600 hover:bg-secondary-200 border border-secondary-200'
          }`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button 
          className={`px-4 py-2 rounded-md text-sm font-medium min-w-[80px] ${
            filter === 'completed' 
              ? 'bg-primary-100 text-primary-800 border border-primary-200' 
              : 'bg-secondary-100 text-secondary-600 hover:bg-secondary-200 border border-secondary-200'
          }`}
          onClick={() => setFilter('completed')}
        >
          Completed
        </button>
        <button 
          className={`px-4 py-2 rounded-md text-sm font-medium min-w-[80px] ${
            filter === 'processing' 
              ? 'bg-primary-100 text-primary-800 border border-primary-200' 
              : 'bg-secondary-100 text-secondary-600 hover:bg-secondary-200 border border-secondary-200'
          }`}
          onClick={() => setFilter('processing')}
        >
          In Progress
        </button>
        <button 
          className={`px-4 py-2 rounded-md text-sm font-medium min-w-[80px] ${
            filter === 'failed' 
              ? 'bg-primary-100 text-primary-800 border border-primary-200' 
              : 'bg-secondary-100 text-secondary-600 hover:bg-secondary-200 border border-secondary-200'
          }`}
          onClick={() => setFilter('failed')}
        >
          Failed
        </button>
      </div>
      
      {/* Fixed height content container */}
      <div className="min-h-[500px]">
        {isLoading ? (
          <div className="flex justify-center items-center h-[500px]">
            <div className="spinner"></div>
          </div>
        ) : error ? (
          <div className="card p-6 text-center h-[500px] flex items-center justify-center">
            <p className="text-secondary-600">{error}</p>
          </div>
        ) : filteredRenovations.length === 0 ? (
          <div className="card p-8 text-center h-[500px] flex flex-col items-center justify-center">
            <svg className="h-16 w-16 text-secondary-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            
            {filter === 'all' ? (
              <>
                <h3 className="text-lg font-semibold text-secondary-700 mb-2">No Renovations Found</h3>
                <p className="text-secondary-600 mb-4">
                  You haven't created any yard renovations yet. Get started with your first one!
                </p>
                <Link to="/renovate" className={`btn-primary inline-block ${user?.creditBalance && user.creditBalance > 0 ? '' : 'opacity-50 pointer-events-none'}`}>
                  Create Your First Renovation
                </Link>
              </>
            ) : (
              <>
                <h3 className="text-lg font-semibold text-secondary-700 mb-2">No {filter === 'processing' ? 'In Progress' : filter === 'completed' ? 'Completed' : 'Failed'} Renovations</h3>
                <p className="text-secondary-600 mb-4">
                  Try selecting a different filter option.
                </p>
                <button 
                  onClick={() => setFilter('all')}
                  className="btn-secondary inline-block"
                >
                  View All Renovations
                </button>
              </>
            )}
            
            {user?.creditBalance && user.creditBalance < 1 && (
              <div className="mt-4 text-sm text-secondary-500">
                You need at least 1 credit to create a renovation. <Link to="/pricing" className="text-sm font-medium underline hover:text-primary-600">Buy credits</Link>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRenovations.map((renovation) => (
                <Link 
                  key={renovation.requestId} 
                  to={`/result/${renovation.requestId}`}
                  className="card overflow-hidden hover:shadow-md transition-shadow h-full"
                >
                  <div className="aspect-w-16 aspect-h-9 bg-secondary-100 relative">
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
                    
                    {/* Status badge */}
                    <div className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-medium ${
                      renovation.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : renovation.status === 'processing'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {renovation.status === 'completed'
                        ? 'Completed'
                        : renovation.status === 'processing'
                        ? 'Processing'
                        : 'Failed'}
                    </div>
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
                      Level: {renovation.renovationOptions?.level || 'Standard'}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => goToPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === 1
                        ? 'text-secondary-400 cursor-not-allowed'
                        : 'text-secondary-700 hover:bg-secondary-100'
                    }`}
                  >
                    &lt;
                  </button>
                  
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => goToPage(i + 1)}
                      className={`px-3 py-1 rounded-md ${
                        currentPage === i + 1
                          ? 'bg-primary-100 text-primary-800 font-medium'
                          : 'text-secondary-700 hover:bg-secondary-100'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === totalPages
                        ? 'text-secondary-400 cursor-not-allowed'
                        : 'text-secondary-700 hover:bg-secondary-100'
                    }`}
                  >
                    &gt;
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MyRenovationsPage;