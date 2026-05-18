import React, { useEffect } from 'react';

/**
 * ProtectedRoute Component (Parent Component)
 * Wraps routes that require authentication
 * Redirects to login if user is not authenticated
 */
function ProtectedRoute({ children, navigateTo }) {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  useEffect(() => {
    if (!isLoggedIn) {
      navigateTo('login');
    }
  }, [isLoggedIn, navigateTo]);

  if (!isLoggedIn) {
    return null;
  }

  return children;
}

export default ProtectedRoute;

