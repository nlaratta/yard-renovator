/**
 * @fileoverview Features page component
 */

import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Feature item type
 */
interface FeatureItem {
  title: string;
  description: string;
  icon: React.ReactNode;
}

/**
 * Features page component
 * @returns {JSX.Element} Features page component
 */
const FeaturesPage: React.FC = () => {
  // Feature items
  const features: FeatureItem[] = [
    {
      title: 'AI-Powered Renovations',
      description: 'Upload a photo of your yard or outdoor space and our advanced AI technology will transform it according to your preferences. We combine Google\'s Gemini API for image generation with OpenAI\'s GPT for prompt creation to deliver stunning, realistic visualizations.',
      icon: (
        <svg className="h-12 w-12 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      )
    },
    {
      title: 'Multiple Renovation Themes',
      description: 'Choose from a variety of themes including Modern Garden, Cottage Garden, Japanese Zen, Mediterranean, Desert Xeriscape, Tropical Oasis, Family-Friendly, and Eco-Friendly. Each theme offers a distinct style and plant palette to match your preferences.',
      icon: (
        <svg className="h-12 w-12 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      title: 'Customization Options',
      description: 'Specify your renovation level from minimal to complete transformation, and add custom notes about specific elements you want included. Our AI will consider all your preferences to create a personalized renovation design.',
      icon: (
        <svg className="h-12 w-12 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
      )
    },
    {
      title: 'Product Recommendations',
      description: 'Get personalized Amazon product recommendations based on your renovation. We suggest real, purchasable plants, furniture, and decorative elements that match your chosen theme and can help you bring your virtual renovation to life.',
      icon: (
        <svg className="h-12 w-12 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      )
    },
    {
      title: 'Save and Share',
      description: 'Save your renovation projects to revisit later and easily share them with friends, family, or contractors. Each renovation has a unique link that displays both the original photo and the AI-generated transformation.',
      icon: (
        <svg className="h-12 w-12 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
      )
    },
    {
      title: 'Flexible Credit System',
      description: 'Our simple credit system lets you pay only for what you need. Purchase credits in packages and use them whenever you want - they never expire. Each renovation costs just one credit.',
      icon: (
        <svg className="h-12 w-12 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: 'Secure Authentication',
      description: 'Sign in securely with your Google account - no need to create yet another username and password. Your information is kept private and secure at all times.',
      icon: (
        <svg className="h-12 w-12 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      )
    },
    {
      title: 'Mobile-Friendly Design',
      description: 'Create renovations on the go with our fully responsive design. Take a photo with your phone, upload it to our app, and get your AI renovation right away - all from your mobile device.',
      icon: (
        <svg className="h-12 w-12 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      )
    }
  ];
  
  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-secondary-800 mb-4">Features</h1>
        <p className="text-lg text-secondary-600 max-w-3xl mx-auto">
          Discover how Yard Renovator transforms your outdoor spaces with the power of AI,
          creating beautiful, realistic renovations tailored to your preferences.
        </p>
      </div>
      
      {/* Features grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {features.map((feature, index) => (
          <div key={index} className="card p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start">
              <div className="shrink-0 mr-4">
                {feature.icon}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-secondary-800 mb-2">{feature.title}</h2>
                <p className="text-secondary-600">{feature.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* How it works section */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-secondary-800 mb-8 text-center">How It Works</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="card p-6 text-center">
            <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-xl font-bold text-primary-700">1</span>
            </div>
            <h3 className="font-semibold text-secondary-800 mb-2">Upload Your Photo</h3>
            <p className="text-secondary-600">
              Take a photo of your yard or outdoor space and upload it to our platform.
            </p>
          </div>
          
          <div className="card p-6 text-center">
            <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-xl font-bold text-primary-700">2</span>
            </div>
            <h3 className="font-semibold text-secondary-800 mb-2">Choose Your Theme</h3>
            <p className="text-secondary-600">
              Select a renovation theme and specify your desired level of transformation.
            </p>
          </div>
          
          <div className="card p-6 text-center">
            <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-xl font-bold text-primary-700">3</span>
            </div>
            <h3 className="font-semibold text-secondary-800 mb-2">AI Generation</h3>
            <p className="text-secondary-600">
              Our AI combines OpenAI and Gemini to create a realistic renovation visualization.
            </p>
          </div>
          
          <div className="card p-6 text-center">
            <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-xl font-bold text-primary-700">4</span>
            </div>
            <h3 className="font-semibold text-secondary-800 mb-2">Get Results</h3>
            <p className="text-secondary-600">
              View your renovation with product recommendations to bring your vision to life.
            </p>
          </div>
        </div>
      </div>
      
      {/* Call to action */}
      <div className="card p-8 border border-primary-200 mb-16 text-center">
        <h2 className="text-2xl font-bold text-secondary-800 mb-4">Ready to Transform Your Yard?</h2>
        <p className="text-lg text-secondary-600 mb-6 max-w-3xl mx-auto">
          Start creating beautiful, realistic yard renovations with our AI technology. 
          Sign up today and get started with your first renovation in minutes.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/renovate" className="btn-primary px-8 py-3">
            Try It Now
          </Link>
          <Link to="/pricing" className="btn-secondary px-8 py-3">
            View Pricing
          </Link>
        </div>
      </div>
      
      {/* Testimonials teaser */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-secondary-800 mb-4">What Our Users Say</h2>
        <div className="max-w-2xl mx-auto bg-primary-50 rounded-lg p-6 border border-primary-100 italic text-secondary-700">
          "Yard Renovator helped me visualize the potential of my backyard before investing in actual renovations. 
          The AI suggestions were realistic and gave me great ideas that I never would have thought of myself. 
          I'm so pleased with how my yard turned out after following the design!"
          <div className="mt-4 font-medium text-secondary-800 not-italic">
            — Sarah M., Homeowner
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesPage; 