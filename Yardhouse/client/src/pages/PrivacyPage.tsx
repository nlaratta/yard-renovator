/**
 * @fileoverview Privacy Policy page component
 */

import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Privacy Policy page component
 * @returns {JSX.Element} Privacy Policy page component
 */
const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-secondary-800 mb-6">Privacy Policy</h1>
      
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-8">
        <p className="text-blue-800">
          <strong>Last Updated:</strong> April 1, 2023
        </p>
      </div>
      
      <div className="prose prose-lg max-w-none">
        <p>
          At Yard Renovator, we value your privacy and are committed to protecting your personal information.
          This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you
          use our web application. Please read this Privacy Policy carefully. By using the Yard Renovator
          application, you consent to the data practices described in this statement.
        </p>
        
        <h2>Information We Collect</h2>
        <p>We collect the following types of information:</p>
        <ul>
          <li>
            <strong>Personal Information:</strong> When you create an account, we collect information such as
            your name, email address, and profile picture through your Google account.
          </li>
          <li>
            <strong>Yard Images:</strong> We collect and store the photographs of yards that you upload to 
            our service for the purpose of generating renovations.
          </li>
          <li>
            <strong>Generated Content:</strong> We store the AI-generated renovations created based on your inputs.
          </li>
          <li>
            <strong>Usage Data:</strong> We collect information about how you interact with our application,
            including the features you use, pages you visit, and actions you take.
          </li>
          <li>
            <strong>Payment Information:</strong> If you purchase credits, we collect payment information,
            though actual payment processing is handled by PayPal, which has its own privacy policy.
          </li>
        </ul>
        
        <h2>How We Use Your Information</h2>
        <p>We use the information we collect to:</p>
        <ul>
          <li>Provide, maintain, and improve our services</li>
          <li>Generate AI renovations of your yard photos</li>
          <li>Process transactions and manage your account</li>
          <li>Send you updates, security alerts, and support messages</li>
          <li>Respond to your comments and questions</li>
          <li>Develop new features and services</li>
          <li>Monitor usage patterns and analyze trends</li>
          <li>Prevent fraudulent transactions and monitor against errors</li>
        </ul>
        
        <h2>How We Share Your Information</h2>
        <p>We may share your information in the following circumstances:</p>
        <ul>
          <li>
            <strong>Service Providers:</strong> We share information with third-party vendors who provide services 
            on our behalf, such as hosting, analytics, and customer service. These providers are bound by 
            confidentiality obligations and are not permitted to use your personal data for any other purposes.
          </li>
          <li>
            <strong>AI Partners:</strong> We use Google's Gemini API and OpenAI's services to generate 
            renovations, and your yard images are processed through these services.
          </li>
          <li>
            <strong>Legal Requirements:</strong> We may disclose your information if required to do so by law 
            or in response to valid requests by public authorities.
          </li>
          <li>
            <strong>Business Transfers:</strong> If we are involved in a merger, acquisition, or sale of all 
            or a portion of our assets, your information may be transferred as part of that transaction.
          </li>
          <li>
            <strong>With Your Consent:</strong> We may share your information with third parties when you 
            explicitly consent to such sharing.
          </li>
        </ul>
        
        <h2>Data Security</h2>
        <p>
          We implement appropriate technical and organizational measures to protect the security of your 
          personal information. However, please be aware that no method of transmission over the Internet 
          or method of electronic storage is 100% secure. While we strive to use commercially acceptable 
          means to protect your personal information, we cannot guarantee its absolute security.
        </p>
        
        <h2>Your Privacy Rights</h2>
        <p>Depending on your location, you may have certain rights regarding your personal information, including:</p>
        <ul>
          <li>The right to access your personal information</li>
          <li>The right to rectify inaccurate information</li>
          <li>The right to request deletion of your information</li>
          <li>The right to restrict or object to processing</li>
          <li>The right to data portability</li>
          <li>The right to withdraw consent</li>
        </ul>
        <p>
          To exercise any of these rights, please contact us using the information provided at the end of this Privacy Policy.
        </p>
        
        <h2>Children's Privacy</h2>
        <p>
          Our service is not directed to children under the age of 13, and we do not knowingly collect 
          personal information from children under 13. If we learn that we have collected personal 
          information from a child under 13, we will promptly delete that information.
        </p>
        
        <h2>Changes to This Privacy Policy</h2>
        <p>
          We may update our Privacy Policy from time to time. We will notify you of any changes by posting 
          the new Privacy Policy on this page and updating the "Last Updated" date at the top. You are 
          advised to review this Privacy Policy periodically for any changes.
        </p>
        
        <h2>Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us at:
          <br />
          <a href="mailto:privacy@yardrenovator.com" className="text-primary-600 hover:underline">
            privacy@yardrenovator.com
          </a>
        </p>
      </div>
      
      <div className="mt-12 text-center">
        <p className="text-secondary-600 mb-4">
          By using Yard Renovator, you agree to the terms outlined in this Privacy Policy.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/terms" className="text-primary-600 hover:underline">Terms of Service</Link>
          <Link to="/about" className="text-primary-600 hover:underline">About Us</Link>
          <Link to="/contact" className="text-primary-600 hover:underline">Contact</Link>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage; 