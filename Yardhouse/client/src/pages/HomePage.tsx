/**
 * @fileoverview Home page component for the Yard Renovator application
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Home page component
 * @returns {JSX.Element} Home page component
 */
const HomePage: React.FC = () => {
  const { state, login } = useAuth();
  const { isAuthenticated, user } = state;

  return (
    <div>
      {/* Hero section */}
      <div className="bg-gradient-to-r from-primary-800 to-primary-700 py-16 mb-12 -mt-8 -mx-4 sm:-mx-6 lg:-mx-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 text-white mb-8 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Transform Your Yard with AI</h1>
            <p className="text-lg mb-6">
              Upload a photo of your outdoor space and see it transformed with our AI-powered renovation tool. Get product recommendations for your dream yard.
            </p>
            {isAuthenticated ? (
              <Link 
                to="/renovate" 
                className="btn-accent inline-block text-lg px-6 py-3 rounded-lg"
              >
                Start Your Renovation
              </Link>
            ) : (
              <button 
                onClick={login} 
                className="btn-accent inline-block text-lg px-6 py-3 rounded-lg"
              >
                Sign in to Get Started
              </button>
            )}
          </div>
          <div className="md:w-1/2 md:pl-8">
            <div className="relative">
              <div className="absolute -left-4 -top-4 w-3/4 h-3/4 bg-primary-600 rounded-lg transform -rotate-6"></div>
              <div className="absolute -right-4 -bottom-4 w-3/4 h-3/4 bg-accent-beige rounded-lg transform rotate-6"></div>
              <div className="relative">
                <img 
                  src="/yard-before-after.jpg" 
                  alt="Yard transformation before and after" 
                  className="rounded-lg shadow-xl w-full max-w-md mx-auto"
                  onError={(e) => {
                    // Fallback for missing image
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://d4c5gb8slvq7w.cloudfront.net/eyJlZGl0cyI6eyJyZXNpemUiOnsid2lkdGgiOjcwMCwiaGVpZ2h0IjozOTR9fSwiYnVja2V0IjoiZmluZWdhcmRlbmluZy5zMy50YXVudG9uY2xvdWQuY29tIiwia2V5IjoiYXBwXC91cGxvYWRzXC8yMDE1XC8wMVwvMTkxMjQ2NTVcL2ZnLWdhcmRlbnRyYW5zZm9ybWF0aW9uLW1haW4tNzAweDM5NC5qcGcifQ==';
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How it works section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-secondary-800 mb-8 text-center">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center mb-4 text-2xl font-bold">1</div>
            <h3 className="text-xl font-semibold text-secondary-700 mb-2">Upload Your Photo</h3>
            <p className="text-secondary-600">Take a photo of your yard or outdoor space and upload it to our platform.</p>
          </div>
          <div className="card flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center mb-4 text-2xl font-bold">2</div>
            <h3 className="text-xl font-semibold text-secondary-700 mb-2">Choose Your Style</h3>
            <p className="text-secondary-600">Select a renovation theme and level to transform your outdoor space.</p>
          </div>
          <div className="card flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center mb-4 text-2xl font-bold">3</div>
            <h3 className="text-xl font-semibold text-secondary-700 mb-2">Get Recommendations</h3>
            <p className="text-secondary-600">Receive AI-generated renovation images and product recommendations.</p>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-secondary-800 mb-8 text-center">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="card">
            <h3 className="text-xl font-semibold text-secondary-700 mb-2 flex items-center">
              <svg className="w-5 h-5 text-primary-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              AI-Powered Transformations
            </h3>
            <p className="text-secondary-600">Our advanced AI creates realistic visualizations of your yard renovations in various styles.</p>
          </div>
          <div className="card">
            <h3 className="text-xl font-semibold text-secondary-700 mb-2 flex items-center">
              <svg className="w-5 h-5 text-primary-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Product Recommendations
            </h3>
            <p className="text-secondary-600">Get real product suggestions to bring your renovation to life with easy purchasing options.</p>
          </div>
          <div className="card">
            <h3 className="text-xl font-semibold text-secondary-700 mb-2 flex items-center">
              <svg className="w-5 h-5 text-primary-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Multiple Renovation Styles
            </h3>
            <p className="text-secondary-600">Choose from various themes including modern, cottage garden, zen, tropical, and more.</p>
          </div>
          <div className="card">
            <h3 className="text-xl font-semibold text-secondary-700 mb-2 flex items-center">
              <svg className="w-5 h-5 text-primary-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Secure and Private
            </h3>
            <p className="text-secondary-600">Your photos and information are kept secure with our encrypted platform and Google authentication.</p>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="bg-primary-50 rounded-lg p-8 text-center">
        <h2 className="text-3xl font-bold text-secondary-800 mb-4">Ready to Transform Your Outdoor Space?</h2>
        <p className="text-lg text-secondary-700 mb-6 max-w-2xl mx-auto">
          Join thousands of homeowners who have discovered the power of AI to renovate their yards.
        </p>
        {isAuthenticated ? (
          <Link 
            to="/renovate" 
            className="btn-primary inline-block text-lg px-6 py-3 rounded-lg"
          >
            Start Your Renovation
          </Link>
        ) : (
          <button 
            onClick={login} 
            className="btn-primary inline-block text-lg px-6 py-3 rounded-lg"
          >
            Get Started Now
          </button>
        )}
      </section>
    </div>
  );
};

export default HomePage; 