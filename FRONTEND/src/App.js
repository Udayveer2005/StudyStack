import { useState } from 'react';
import Home from './pages/Home.jsx';
import SignUp from './pages/SignUp.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Course from './pages/Course.jsx';
import AllCourses from './pages/AllCourses.jsx';
import OperatingSystemOverview from './pages/OperatingSystemOverview.jsx';
import OperatingSystemCourse from './pages/OperatingSystemCourse.jsx';
import ReactCourseOverview from './pages/ReactCourseOverview.jsx';
import EnrolledCourse from './pages/EnrolledCourse.jsx';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute.jsx';
import './App.css';
import Cart from './pages/Cart.jsx';
import Checkout from './pages/Checkout.jsx';
import TeacherDashboard from './pages/TeacherDashboard.jsx';
import StudentTests from './pages/StudentTests.jsx';
import TeacherTests from './pages/TeacherTests.jsx';

/**
 * App Component (Root Component)
 * Manages navigation using state instead of React Router
 * Also manages simple cart state for course purchases
 */
function App() {
  // State to manage current page/view
  const [currentPage, setCurrentPage] = useState('home');

  // State to manage cart items for courses
  const [cartItems, setCartItems] = useState([]);

  /**
   * Function to handle navigation between pages
   * Replaces React Router's navigation
   */
  const navigateTo = (page) => {
    setCurrentPage(page);
  };

  /**
   * Handle adding a course to the cart
   * Requires the user to be logged in
   */
  const handleAddToCart = (course) => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    if (!isLoggedIn) {
      alert('Please login first to buy courses.');
      navigateTo('login');
      return;
    }

    setCartItems((prevItems) => {
      // Avoid adding duplicates
      const exists = prevItems.some((item) => item.id === course.id);
      if (exists) {
        return prevItems;
      }
      return [...prevItems, course];
    });

    // Go to cart after adding
    navigateTo('cart');
  };

  /**
   * Render the appropriate component based on currentPage state
   */
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home navigateTo={navigateTo} />;
      case 'signup':
        return <SignUp navigateTo={navigateTo} />;
      case 'login':
        return <Login navigateTo={navigateTo} />;
      case 'course':
        return (
          <Course
            navigateTo={navigateTo}
            onAddToCart={handleAddToCart}
          />
        );
      case 'all-courses':
        return (
          <AllCourses
            navigateTo={navigateTo}
            onAddToCart={handleAddToCart}
          />
        );
      case 'operating-system':
        return (
          <ProtectedRoute navigateTo={navigateTo}>
            <OperatingSystemCourse navigateTo={navigateTo} />
          </ProtectedRoute>
        );
      case 'operating-system-overview':
        return <OperatingSystemOverview navigateTo={navigateTo} />;
      case 'react-course-overview':
        return (
          <ProtectedRoute navigateTo={navigateTo}>
            <ReactCourseOverview navigateTo={navigateTo} />
          </ProtectedRoute>
        );
      case 'enrolled-course':
        return (
          <ProtectedRoute navigateTo={navigateTo}>
            <EnrolledCourse navigateTo={navigateTo} />
          </ProtectedRoute>
        );
      case 'dashboard':
        return (
          <ProtectedRoute navigateTo={navigateTo}>
            <Dashboard navigateTo={navigateTo} />
          </ProtectedRoute>
        );
      case 'teacher-dashboard':
        return (
          <ProtectedRoute navigateTo={navigateTo}>
            <TeacherDashboard navigateTo={navigateTo} />
          </ProtectedRoute>
        );
      case 'student-tests':
        return (
          <ProtectedRoute navigateTo={navigateTo}>
            <StudentTests navigateTo={navigateTo} />
          </ProtectedRoute>
        );
      case 'teacher-tests':
        return (
          <ProtectedRoute navigateTo={navigateTo}>
            <TeacherTests navigateTo={navigateTo} />
          </ProtectedRoute>
        );
      case 'cart':
        return (
          <ProtectedRoute navigateTo={navigateTo}>
            <Cart
              navigateTo={navigateTo}
              cartItems={cartItems}
              setCartItems={setCartItems}
            />
          </ProtectedRoute>
        );
      case 'checkout':
        return (
          <ProtectedRoute navigateTo={navigateTo}>
            <Checkout
              navigateTo={navigateTo}
              cartItems={cartItems}
              setCartItems={setCartItems}
            />
          </ProtectedRoute>
        );
      default:
        return <Home navigateTo={navigateTo} />;
    }
  };

  return (
    <div className="app">
      {renderPage()}
    </div>
  );
}

export default App;
