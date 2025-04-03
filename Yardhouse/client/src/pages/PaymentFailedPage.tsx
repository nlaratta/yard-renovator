/**
 * @fileoverview Payment Failed page component
 */

import React, { useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Payment Failed page component
 * @returns {JSX.Element} Payment Failed page component
 */
const PaymentFailedPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { state } = useAuth();
  const { isAuthenticated } = state;
  
  const error = searchParams.get('error') || 'There was an issue processing your payment.';
  const packageId = searchParams.get('package') || 'standard';
  
  useEffect(() => {
    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    // Scroll to top
    window.scrollTo(0, 0);
  }, [isAuthenticated, navigate]);
  
  // Get package details
  const getPackageDetails = () => {
    switch (packageId) {
      case 'starter':
        return {
          name: 'Starter',
          credits: 5,
          price: '$9.99'
        };
      case 'pro':
        return {
          name: 'Professional',
          credits: 50,
          price: '$69.99'
        };
      case 'standard':
      default:
        return {
          name: 'Standard',
          credits: 15,
          price: '$24.99'
        };
    }
  };
  
  const packageDetails = getPackageDetails();
  
  return (
    <div className="max-w-lg mx-auto text-center">
      <div className="mb-8">
        <div className="bg-red-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
          <svg className="h-10 w-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-secondary-800 mb-2">Payment Failed</h1>
        <p className="text-lg text-secondary-600">
          We were unable to process your payment. No charges have been made.
        </p>
      </div>
      
      <div className="card p-6 mb-8 bg-red-50 border border-red-100">
        <h2 className="text-xl font-semibold text-secondary-800 mb-4">Error Details</h2>
        <p className="text-red-700 mb-4">
          {error}
        </p>
        <div className="border-t border-red-200 pt-4 mt-4 text-left">
          <h3 className="font-medium text-secondary-800 mb-2">Your attempted purchase:</h3>
          <div className="flex justify-between items-center mb-2">
            <span className="text-secondary-700">Package:</span>
            <span className="text-secondary-700">{packageDetails.name}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-secondary-700">Credits:</span>
            <span className="text-secondary-700">{packageDetails.credits} credits</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-secondary-700">Amount:</span>
            <span className="text-secondary-700">{packageDetails.price}</span>
          </div>
        </div>
      </div>
      
      <div className="card p-6 mb-8">
        <h2 className="text-xl font-semibold text-secondary-800 mb-4">What Went Wrong?</h2>
        <div className="text-left space-y-3 text-secondary-700 mb-6">
          <p>Your payment may have failed for one of the following reasons:</p>
          <ul className="list-disc list-inside ml-4">
            <li>Insufficient funds in your account</li>
            <li>Card expired or invalid</li>
            <li>Bank declined the transaction</li>
            <li>PayPal account issues</li>
            <li>Temporary payment system error</li>
          </ul>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/pricing" 
            className="btn-primary"
          >
            Try Again
          </Link>
          <Link 
            to="/contact" 
            className="btn-secondary"
          >
            Contact Support
          </Link>
        </div>
      </div>
      
      <div className="text-sm text-secondary-500">
        <p>
          If you continue to experience issues, please try a different payment method or 
          contact our <Link to="/contact" className="text-primary-600 hover:underline">support team</Link> for assistance.
        </p>
      </div>
    </div>
  );
};

export default PaymentFailedPage; 