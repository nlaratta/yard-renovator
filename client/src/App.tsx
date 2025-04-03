/**
 * @fileoverview Main App component for the Yard Renovator application
 * Sets up routing and page structure
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layout components
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/Auth/ProtectedRoute';

// Page components (to be created later)
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import PricingPage from './pages/PricingPage';
import DashboardPage from './pages/DashboardPage';
import RenovatePage from './pages/RenovatePage';
import MyRenovationsPage from './pages/MyRenovationsPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';
import ResultPage from './pages/ResultPage';
import AboutPage from './pages/AboutPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import FeaturesPage from './pages/FeaturesPage';
import FAQsPage from './pages/FAQsPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import PaymentFailedPage from './pages/PaymentFailedPage';

/**
 * Main App component with routing
 * @returns {JSX.Element} App component
 */
const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Layout><HomePage /></Layout>} />
        <Route path="/login" element={<Layout><LoginPage /></Layout>} />
        <Route path="/pricing" element={<Layout><PricingPage /></Layout>} />
        <Route path="/payment-success" element={<Layout><PaymentSuccessPage /></Layout>} />
        <Route path="/payment-failed" element={<Layout><PaymentFailedPage /></Layout>} />
        <Route path="/about" element={<Layout><AboutPage /></Layout>} />
        <Route path="/terms" element={<Layout><TermsPage /></Layout>} />
        <Route path="/privacy" element={<Layout><PrivacyPage /></Layout>} />
        <Route path="/features" element={<Layout><FeaturesPage /></Layout>} />
        <Route path="/faqs" element={<Layout><FAQsPage /></Layout>} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Layout><DashboardPage /></Layout>} />
          <Route path="/profile" element={<Layout><ProfilePage /></Layout>} />
          <Route path="/my-renovations" element={<Layout><MyRenovationsPage /></Layout>} />

          {/* Routes requiring credits */}
          <Route element={<ProtectedRoute requiredCredits={1} />}>
            <Route path="/renovate" element={<Layout><RenovatePage /></Layout>} />
          </Route>
        </Route>

        {/* Result page is public for sharing but displays a login prompt for non-authenticated users */}
        <Route path="/result/:id" element={<Layout><ResultPage /></Layout>} />

        {/* 404 page */}
        <Route path="/404" element={<Layout><NotFoundPage /></Layout>} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Router>
  );
};

export default App; 