import React from 'react';
import './Navbar.css';

/**
 * Navbar Component
 * Displays navigation links based on authentication status
 * Shows different links for logged in vs logged out users
 */
function Navbar({ navigateTo }) {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const username = localStorage.getItem('username');
  const role = localStorage.getItem('role') || 'student';
  const isTeacher = role === 'teacher';

  /**
   * Handle logout functionality
   * Clears localStorage and redirects to home
   */
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    localStorage.removeItem('accessToken');
    navigateTo('home');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <button onClick={() => navigateTo('home')} className="navbar-logo">
          StudyStack
        </button>

        <div className="navbar-links">
          <button onClick={() => navigateTo('home')} className="navbar-link">Home</button>
          {!isTeacher && (
            <>
              <button onClick={() => navigateTo('all-courses')} className="navbar-link">Courses</button>
              <button onClick={() => navigateTo('cart')} className="navbar-link">Cart</button>
              {isLoggedIn && (
                <button onClick={() => navigateTo('student-tests')} className="navbar-link">Tests</button>
              )}
            </>
          )}

          {isLoggedIn ? (
            <>
              {isTeacher && (
                <button onClick={() => navigateTo('teacher-tests')} className="navbar-link">Tests</button>
              )}
              <button
                onClick={() => navigateTo(role === 'teacher' ? 'teacher-dashboard' : 'dashboard')}
                className="navbar-link"
              >
                {role === 'teacher' ? 'Teacher Panel' : 'Dashboard'}
              </button>
              <span className="navbar-user">Welcome, {username}!</span>
              <button onClick={handleLogout} className="navbar-logout">
                Logout
              </button>
            </>
          ) : (
            <>
              <button onClick={() => navigateTo('login')} className="navbar-link">Login</button>
              <button onClick={() => navigateTo('signup')} className="navbar-link navbar-signup">
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

