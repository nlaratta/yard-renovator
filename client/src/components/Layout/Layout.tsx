/**
 * @fileoverview Layout component for the Yard Renovator application
 * Provides consistent page structure with header and footer
 */

import React from 'react';
import Header from './Header';
import Footer from './Footer';

/**
 * Layout component props
 * @interface LayoutProps
 */
interface LayoutProps {
  /**
   * Child components to render in the layout
   */
  children: React.ReactNode;
  /**
   * Whether the layout should have padding
   */
  noPadding?: boolean;
}

/**
 * Layout component for consistent page structure
 * @param {LayoutProps} props - Component props
 * @returns {JSX.Element} Layout component
 */
const Layout: React.FC<LayoutProps> = ({ children, noPadding = false }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className={`flex-grow ${!noPadding ? 'page-container' : ''}`}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout; 