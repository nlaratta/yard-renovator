/**
 * @fileoverview FAQs page component
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * FAQ item type
 */
interface FAQItem {
  question: string;
  answer: React.ReactNode;
  category: string;
}

/**
 * FAQs page component
 * @returns {JSX.Element} FAQs page component
 */
const FAQsPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('general');
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  
  /**
   * Toggle FAQ open/close
   * @param {number} index - FAQ index
   */
  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };
  
  // FAQ items organized by category
  const faqs: FAQItem[] = [
    // General
    {
      question: 'What is Yard Renovator?',
      answer: (
        <p>
          Yard Renovator is an AI-powered web application that allows you to upload photos of your yard or outdoor
          space and receive realistic visualizations of renovation possibilities. We use Google's Gemini API for
          image generation combined with OpenAI's GPT for prompt creation to transform your space digitally.
        </p>
      ),
      category: 'general'
    },
    {
      question: 'How accurate are the renovations?',
      answer: (
        <p>
          Our AI-generated renovations are intended to provide inspiration and visualization rather than exact
          landscape architectural plans. The renovations show realistic possibilities based on the themes and
          options you select, but implementation details would require professional consultation.
        </p>
      ),
      category: 'general'
    },
    {
      question: 'Can I use Yard Renovator on my mobile device?',
      answer: (
        <p>
          Yes! Yard Renovator is fully responsive and works on mobile devices, tablets, and desktop computers.
          You can take a photo of your yard with your phone and immediately upload it to create a renovation.
        </p>
      ),
      category: 'general'
    },
    
    // Credits and Billing
    {
      question: 'How does the credit system work?',
      answer: (
        <p>
          Each renovation you create costs 1 credit. Credits can be purchased in packages of various sizes
          through our secure payment processor. Once purchased, credits never expire and remain in your account
          until used.
        </p>
      ),
      category: 'credits'
    },
    {
      question: 'What payment methods do you accept?',
      answer: (
        <p>
          We process payments through PayPal, which accepts major credit cards, debit cards, and PayPal account
          balances. All transactions are secure and encrypted.
        </p>
      ),
      category: 'credits'
    },
    {
      question: 'Can I get a refund for unused credits?',
      answer: (
        <p>
          Generally, credit purchases are non-refundable. However, if you've experienced technical issues that
          prevented you from using your credits, please contact our support team at{' '}
          <a href="mailto:support@yardrenovator.com" className="text-primary-600 hover:underline">
            support@yardrenovator.com
          </a>{' '}
          and we'll work with you to resolve the issue.
        </p>
      ),
      category: 'credits'
    },
    
    // Using the Service
    {
      question: 'What types of renovation themes are available?',
      answer: (
        <p>
          We offer a variety of themes including Modern Garden, Cottage Garden, Japanese Zen, Mediterranean,
          Desert Xeriscape, Tropical Oasis, Family-Friendly, Eco-Friendly, and more. Each theme provides a
          distinct style and plant palette for your yard renovation.
        </p>
      ),
      category: 'using'
    },
    {
      question: 'How do I get the best results from my renovation?',
      answer: (
        <div>
          <p>For the best results, we recommend:</p>
          <ul className="list-disc list-inside ml-4 mt-2">
            <li>Taking photos in good lighting, preferably on a clear day</li>
            <li>Capturing a wide view of the space you want to renovate</li>
            <li>Avoiding heavily shadowed areas or poor visibility</li>
            <li>Providing detailed notes about specific elements you'd like included</li>
            <li>Trying different themes to see various possibilities for your space</li>
          </ul>
        </div>
      ),
      category: 'using'
    },
    {
      question: 'Can I share my renovation results?',
      answer: (
        <p>
          Yes! Each renovation result has a unique link that you can share with friends, family, or
          contractors. The shared link will show both the original photo and the AI-generated renovation.
          You can also download the images directly to your device.
        </p>
      ),
      category: 'using'
    },
    
    // Technical
    {
      question: 'Is my data secure?',
      answer: (
        <p>
          We take data security seriously. Your photos are encrypted and securely stored, and we only use them
          to provide the renovation service. Please see our{' '}
          <Link to="/privacy" className="text-primary-600 hover:underline">Privacy Policy</Link>{' '}
          for complete details on how we handle your data.
        </p>
      ),
      category: 'technical'
    },
    {
      question: 'What file types and sizes are supported for uploads?',
      answer: (
        <p>
          We support JPEG, PNG, and WebP image formats. The maximum file size for uploads is 10MB.
          For optimal results, we recommend images with a resolution of at least 1024x768 pixels.
        </p>
      ),
      category: 'technical'
    },
    {
      question: 'What happens if the renovation fails to generate?',
      answer: (
        <p>
          If a renovation fails to generate due to technical issues, the credit will not be deducted from
          your account. If you experience persistent issues, please contact our support team with details
          of the problem.
        </p>
      ),
      category: 'technical'
    },
    
    // Account
    {
      question: 'How do I create an account?',
      answer: (
        <p>
          You can create an account by signing in with your Google account. We use Google's secure authentication
          to make the process simple and secure. Just click the "Sign In" button and follow the prompts.
        </p>
      ),
      category: 'account'
    },
    {
      question: 'Can I delete my account?',
      answer: (
        <p>
          Yes, you can delete your account at any time from your account settings page. This will permanently
          remove all your personal information, uploaded photos, and generated renovations from our system.
          Note that any unused credits will be lost when you delete your account.
        </p>
      ),
      category: 'account'
    },
    {
      question: 'What happens to my renovations if I delete my account?',
      answer: (
        <p>
          When you delete your account, all your renovations and uploaded photos are permanently removed from
          our servers. Any shared links to your renovations will no longer work. If you wish to keep your
          renovations, please download them before deleting your account.
        </p>
      ),
      category: 'account'
    }
  ];
  
  // Get FAQs for current category
  const filteredFAQs = faqs.filter(faq => faq.category === activeCategory);
  
  // Categories
  const categories = [
    { id: 'general', name: 'General' },
    { id: 'credits', name: 'Credits & Billing' },
    { id: 'using', name: 'Using the Service' },
    { id: 'technical', name: 'Technical' },
    { id: 'account', name: 'Account' }
  ];
  
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-secondary-800 mb-6">Frequently Asked Questions</h1>
      
      {/* Category tabs */}
      <div className="flex flex-wrap gap-2 mb-8 border-b border-secondary-200 pb-2">
        {categories.map(category => (
          <button
            key={category.id}
            className={`px-4 py-2 rounded-t-lg text-sm font-medium ${
              activeCategory === category.id
                ? 'bg-primary-100 text-primary-800 border border-b-0 border-secondary-200'
                : 'text-secondary-600 hover:text-secondary-800 hover:bg-secondary-50'
            }`}
            onClick={() => setActiveCategory(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>
      
      {/* FAQs accordion */}
      <div className="space-y-4 mb-10">
        {filteredFAQs.map((faq, index) => (
          <div 
            key={index} 
            className="border border-secondary-200 rounded-lg overflow-hidden"
          >
            <button
              className="w-full text-left p-4 flex justify-between items-center hover:bg-secondary-50"
              onClick={() => toggleFAQ(index)}
            >
              <span className="font-medium text-secondary-800">{faq.question}</span>
              <svg 
                className={`h-5 w-5 text-secondary-600 transform transition-transform ${openFAQ === index ? 'rotate-180' : ''}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {openFAQ === index && (
              <div className="p-4 bg-secondary-50 border-t border-secondary-200">
                <div className="text-secondary-700">
                  {faq.answer}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Contact section */}
      <div className="card p-6 border border-primary-200 mb-10">
        <h2 className="text-xl font-semibold text-secondary-800 mb-3 text-center">Still Have Questions?</h2>
        <p className="text-secondary-600 text-center mb-4">
          If you couldn't find the answer you were looking for, feel free to reach out to our support team.
        </p>
        <div className="flex justify-center">
          <Link to="/contact" className="btn-primary">
            Contact Support
          </Link>
        </div>
      </div>
      
      {/* Quick links */}
      <div className="text-center text-sm text-secondary-500 mb-8">
        <p>More Resources:</p>
        <div className="flex justify-center gap-4 mt-2">
          <Link to="/about" className="text-primary-600 hover:underline">About Us</Link>
          <Link to="/terms" className="text-primary-600 hover:underline">Terms of Service</Link>
          <Link to="/privacy" className="text-primary-600 hover:underline">Privacy Policy</Link>
        </div>
      </div>
    </div>
  );
};

export default FAQsPage; 