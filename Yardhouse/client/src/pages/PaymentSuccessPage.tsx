/**
 * @fileoverview Payment Success page component
 */

import React, { useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Payment Success page component
 * @returns {JSX.Element} Payment Success page component
 */
const PaymentSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { state, refreshUser } = useAuth();
  const { isAuthenticated } = state;
  
  const packageId = searchParams.get('package') || 'standard';
  const transactionId = searchParams.get('transaction_id') || '';
  
  useEffect(() => {
    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    // Refresh user data to update credit balance
    refreshUser();
    
    // Scroll to top
    window.scrollTo(0, 0);
  }, [isAuthenticated, navigate, refreshUser]);
  
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
        <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
          <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-secondary-800 mb-2">Payment Successful!</h1>
        <p className="text-lg text-secondary-600">
          Thank you for your purchase. Your credits have been added to your account.
        </p>
      </div>
      
      <div className="card p-6 mb-8">
        <h2 className="text-xl font-semibold text-secondary-700 mb-4">Order Summary</h2>
        
        <div className="border-b border-secondary-200 pb-4 mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium text-secondary-800">Package:</span>
            <span className="text-secondary-700">{packageDetails.name} Package</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium text-secondary-800">Credits:</span>
            <span className="text-secondary-700">{packageDetails.credits} credits</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium text-secondary-800">Amount:</span>
            <span className="text-secondary-700">{packageDetails.price}</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="font-medium text-secondary-800">Transaction ID:</span>
          <span className="text-sm text-secondary-600">{transactionId}</span>
        </div>
      </div>
      
      <div className="card p-6 bg-primary-50 border border-primary-100 mb-8">
        <h2 className="text-xl font-semibold text-secondary-800 mb-2">What's Next?</h2>
        <p className="text-secondary-600 mb-4">
          You're all set to start creating beautiful yard renovations. Your credits are ready to use.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/renovate" 
            className="btn-primary"
          >
            Create a Renovation
          </Link>
          <Link 
            to="/dashboard" 
            className="btn-secondary"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
      
      <div className="text-sm text-secondary-500">
        <p className="mb-2">
          A receipt has been sent to your email address.
        </p>
        <p>
          If you have any questions about your purchase, please contact our{' '}
          <Link to="/contact" className="text-primary-600 hover:underline">support team</Link>.
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccessPage; 