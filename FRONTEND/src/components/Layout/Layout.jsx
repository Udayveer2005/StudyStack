import React from 'react';
import Navbar from '../Navbar/Navbar.jsx';
import './Layout.css';

/**
 * Layout Component (Parent Component)
 * Wraps all pages with a common layout structure
 * Includes navigation bar and main content area
 */
function Layout({ children, navigateTo }) {
  return (
    <div className="layout">
      <Navbar navigateTo={navigateTo} />
      <main className="layout-content">
        {children}
      </main>
    </div>
  );
}

export default Layout;

