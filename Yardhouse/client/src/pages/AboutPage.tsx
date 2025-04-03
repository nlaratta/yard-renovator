/**
 * @fileoverview About page component
 */

import React from 'react';
import { Link } from 'react-router-dom';

/**
 * About page component
 * @returns {JSX.Element} About page component
 */
const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-secondary-800 mb-6">About Yard Renovator</h1>
      
      <div className="prose prose-lg max-w-none mb-10">
        <p>
          Yard Renovator is an innovative web application that leverages artificial intelligence to 
          transform your outdoor spaces. Our mission is to make beautiful yard renovations accessible to everyone,
          providing inspiration and practical ideas for your outdoor projects.
        </p>
        
        <h2>Our Technology</h2>
        <p>
          We combine the power of Google's Gemini AI for image generation with OpenAI's GPT models for prompt creation.
          This powerful combination allows us to create realistic, detailed visualizations of your yard renovations.
          Simply upload a photo of your yard, select your preferred theme and style, and our AI will generate a 
          transformed version of your space.
        </p>
        
        <h2>How It Works</h2>
        <ol>
          <li>
            <strong>Upload your yard photo</strong> - Take a clear photo of the outdoor space you want to renovate.
          </li>
          <li>
            <strong>Choose your renovation theme</strong> - Select from various themes like Modern Garden, 
            Cottage Garden, Japanese Zen, Mediterranean, and more.
          </li>
          <li>
            <strong>Specify renovation level</strong> - Choose between minimal, moderate, or complete transformation.
          </li>
          <li>
            <strong>Add custom notes</strong> - Provide any specific elements or features you'd like to include.
          </li>
          <li>
            <strong>Get your AI-powered renovation</strong> - Our system generates a realistic visualization of your 
            renovated yard, along with product recommendations to bring your vision to life.
          </li>
        </ol>
        
        <h2>The Team</h2>
        <p>
          Yard Renovator was created by a passionate team of developers, designers, and garden enthusiasts who 
          believe in the power of technology to inspire real-world transformations. Our goal is to bridge the gap
          between imagination and implementation, helping you visualize the potential of your outdoor spaces
          before making any physical changes.
        </p>
        
        <h2>Our Values</h2>
        <ul>
          <li>
            <strong>Innovation</strong> - We're constantly improving our AI models and user experience.
          </li>
          <li>
            <strong>Sustainability</strong> - We prioritize eco-friendly design principles and plants suitable for your climate.
          </li>
          <li>
            <strong>Accessibility</strong> - We aim to make professional-quality design inspiration available to everyone.
          </li>
          <li>
            <strong>Privacy</strong> - We take your data privacy seriously and use your uploads only for providing our service.
          </li>
        </ul>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="card p-6 bg-primary-50 border border-primary-100">
          <h3 className="font-semibold text-lg text-secondary-800 mb-3">Powerful AI Technology</h3>
          <p className="text-secondary-600">
            Combining Google's Gemini and OpenAI's GPT models for realistic yard transformations.
          </p>
        </div>
        
        <div className="card p-6 bg-primary-50 border border-primary-100">
          <h3 className="font-semibold text-lg text-secondary-800 mb-3">Product Recommendations</h3>
          <p className="text-secondary-600">
            Get suggestions for real products that can help bring your vision to life.
          </p>
        </div>
        
        <div className="card p-6 bg-primary-50 border border-primary-100">
          <h3 className="font-semibold text-lg text-secondary-800 mb-3">Multiple Design Themes</h3>
          <p className="text-secondary-600">
            Choose from various garden and yard styles to match your preferences.
          </p>
        </div>
      </div>
      
      <div className="card p-8 border border-primary-200 mb-10">
        <h2 className="text-2xl font-bold text-secondary-800 mb-4 text-center">Ready to Transform Your Yard?</h2>
        <p className="text-lg text-secondary-600 text-center mb-6">
          Start creating beautiful, realistic yard renovations in just a few clicks.
        </p>
        <div className="flex justify-center">
          <Link to="/renovate" className="btn-primary px-8 py-3">
            Get Started Today
          </Link>
        </div>
      </div>
      
      <div className="prose prose-lg max-w-none mb-10">
        <h2>Contact Us</h2>
        <p>
          Have questions or feedback about Yard Renovator? We'd love to hear from you! Please visit our 
          <Link to="/contact" className="text-primary-600 hover:underline"> contact page</Link> or 
          send an email to <a href="mailto:support@yardrenovator.com" className="text-primary-600 hover:underline">support@yardrenovator.com</a>.
        </p>
      </div>
    </div>
  );
};

export default AboutPage; 