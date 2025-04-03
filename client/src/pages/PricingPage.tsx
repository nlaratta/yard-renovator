/**
 * @fileoverview Pricing page component
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Credit package type
 */
interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  price: number;
  mostPopular?: boolean;
  savings?: string;
}

/**
 * Pricing page component
 * @returns {JSX.Element} Pricing page component
 */
const PricingPage: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useAuth();
  const { isAuthenticated, user } = state;
  
  const [selectedPackage, setSelectedPackage] = useState<string>('standard');
  
  // Credit packages
  const creditPackages: CreditPackage[] = [
    {
      id: 'starter',
      name: 'Starter',
      credits: 5,
      price: 9.99
    },
    {
      id: 'standard',
      name: 'Standard',
      credits: 15,
      price: 24.99,
      mostPopular: true,
      savings: 'Save 16%'
    },
    {
      id: 'pro',
      name: 'Professional',
      credits: 50,
      price: 69.99,
      savings: 'Save 30%'
    }
  ];
  
  /**
   * Handle package selection
   * @param {string} packageId - Selected package ID
   */
  const handlePackageSelect = (packageId: string) => {
    setSelectedPackage(packageId);
  };
  
  /**
   * Handle checkout
   */
  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    // In a real implementation, this would redirect to the PayPal checkout
    // For now, just redirect to a success page
    window.location.href = `${process.env.REACT_APP_API_URL}/payments/checkout?package=${selectedPackage}`;
  };
  
  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-secondary-800 mb-4">Purchase Credits</h1>
        <p className="text-lg text-secondary-600 max-w-3xl mx-auto">
          Credits are used to generate AI yard renovations. Each renovation costs 1 credit.
          Choose the package that works best for you.
        </p>
      </div>
      
      {/* Credit balance for logged in users */}
      {isAuthenticated && user && (
        <div className="card mb-8 p-6 max-w-md mx-auto">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-secondary-700">Your Credits</h2>
              <p className="text-secondary-600">
                You currently have <span className="font-bold text-primary-700">{user.creditBalance} credits</span>
              </p>
            </div>
            <svg className="h-10 w-10 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      )}
      
      {/* Pricing packages */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
        {creditPackages.map((pkg) => (
          <div 
            key={pkg.id}
            className={`card relative overflow-hidden transition-all ${
              selectedPackage === pkg.id 
                ? 'border-primary-500 shadow-md transform scale-105' 
                : 'border-secondary-200 hover:border-primary-300 hover:shadow-sm'
            }`}
            onClick={() => handlePackageSelect(pkg.id)}
          >
            {pkg.mostPopular && (
              <div className="absolute top-0 right-0 bg-primary-500 text-white text-xs font-bold px-3 py-1 rounded-bl">
                Most Popular
              </div>
            )}
            
            <div className="p-6">
              <h2 className="text-xl font-bold text-secondary-800 mb-2">{pkg.name}</h2>
              
              <div className="flex items-baseline mb-4">
                <span className="text-3xl font-bold text-secondary-900">${pkg.price}</span>
                <span className="text-secondary-600 ml-1">one-time</span>
              </div>
              
              <div className="flex items-center mb-4">
                <svg className="h-8 w-8 text-primary-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-2xl font-bold text-secondary-800">{pkg.credits} Credits</span>
              </div>
              
              {pkg.savings && (
                <div className="bg-primary-50 text-primary-700 text-sm font-semibold py-1 px-2 rounded inline-block mb-4">
                  {pkg.savings}
                </div>
              )}
              
              <ul className="mb-6 text-secondary-600">
                <li className="flex items-center mb-2">
                  <svg className="h-5 w-5 text-primary-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {pkg.credits} AI yard renovations
                </li>
                <li className="flex items-center mb-2">
                  <svg className="h-5 w-5 text-primary-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save and share results
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-primary-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Amazon product recommendations
                </li>
              </ul>
              
              <div className="flex justify-center">
                <input 
                  type="radio" 
                  id={`package-${pkg.id}`} 
                  name="package" 
                  className="sr-only" 
                  checked={selectedPackage === pkg.id}
                  readOnly
                />
                <label 
                  htmlFor={`package-${pkg.id}`}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedPackage === pkg.id ? 'border-primary-500' : 'border-secondary-300'
                  }`}
                >
                  {selectedPackage === pkg.id && (
                    <span className="w-3 h-3 rounded-full bg-primary-500"></span>
                  )}
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Checkout button */}
      <div className="text-center mb-12">
        <button 
          onClick={handleCheckout}
          className="btn-accent px-8 py-3 text-lg"
        >
          Buy Now with PayPal
        </button>
        <p className="text-sm text-secondary-500 mt-2">
          Secure payment processing through PayPal
        </p>
      </div>
      
      {/* FAQ section */}
      <div className="max-w-3xl mx-auto mb-12">
        <h2 className="text-2xl font-bold text-secondary-800 mb-6 text-center">Frequently Asked Questions</h2>
        
        <div className="space-y-4">
          <div className="card p-5">
            <h3 className="font-semibold text-secondary-800 mb-2">What can I do with credits?</h3>
            <p className="text-secondary-600">
              Each credit allows you to generate one AI-powered yard renovation based on your uploaded photo and selected options.
            </p>
          </div>
          
          <div className="card p-5">
            <h3 className="font-semibold text-secondary-800 mb-2">Do credits expire?</h3>
            <p className="text-secondary-600">
              No, your purchased credits never expire and can be used at any time.
            </p>
          </div>
          
          <div className="card p-5">
            <h3 className="font-semibold text-secondary-800 mb-2">Can I get a refund?</h3>
            <p className="text-secondary-600">
              We don't offer refunds for purchased credits, but if you experience any technical issues, please contact our support team.
            </p>
          </div>
          
          <div className="card p-5">
            <h3 className="font-semibold text-secondary-800 mb-2">How do I redeem my credits?</h3>
            <p className="text-secondary-600">
              Simply go to the Renovate page, upload your yard photo, select your renovation options, and click "Generate Renovation". 1 credit will be automatically deducted from your balance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage; 