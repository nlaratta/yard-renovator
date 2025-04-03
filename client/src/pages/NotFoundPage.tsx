/**
 * @fileoverview 404 Not Found page component
 */

import React from 'react';
import { Link } from 'react-router-dom';

/**
 * 404 Not Found page component
 * @returns {JSX.Element} 404 Not Found page component
 */
const NotFoundPage: React.FC = () => {
  return (
    <div className="text-center py-16 max-w-lg mx-auto">
      <h1 className="text-9xl font-bold text-primary-200 mb-4">404</h1>
      <h2 className="text-3xl font-bold text-secondary-800 mb-4">Page Not Found</h2>
      <p className="text-lg text-secondary-600 mb-8">
        The page you are looking for doesn't exist or has been moved.
      </p>
      
      <div className="space-y-4">
        <Link 
          to="/" 
          className="block w-full btn-primary py-3"
        >
          Return Home
        </Link>
        
        <Link 
          to="/renovate" 
          className="block w-full btn-secondary py-3"
        >
          Create a Renovation
        </Link>
      </div>
      
      <div className="mt-12">
        <p className="text-secondary-500 mb-2">Looking for something else?</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/about" className="text-primary-600 hover:underline">About</Link>
          <Link to="/pricing" className="text-primary-600 hover:underline">Pricing</Link>
          <Link to="/faqs" className="text-primary-600 hover:underline">FAQs</Link>
          <Link to="/contact" className="text-primary-600 hover:underline">Contact</Link>
        </div>
      </div>
      
      <div className="mt-16">
        <div className="p-6 bg-primary-50 border border-primary-100 rounded-lg text-left">
          <h3 className="font-semibold text-secondary-800 mb-2">Suggestions:</h3>
          <ul className="text-secondary-600 space-y-2">
            <li className="flex items-start">
              <svg className="h-5 w-5 text-primary-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Check if the URL has been typed correctly</span>
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 text-primary-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Return to the previous page</span>
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 text-primary-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Start from the homepage and navigate to your desired page</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage; 