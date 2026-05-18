import React from 'react';
import Layout from '../components/Layout/Layout.jsx';
import './Cart.css';

/**
 * Cart Page Component
 * Shows selected courses with prices and allows checkout
 * User must be logged in (protected by ProtectedRoute in App)
 */
function Cart({ navigateTo, cartItems, setCartItems }) {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0);

  const handleRemove = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleCheckout = () => {
    if (!isLoggedIn) {
      alert('Please login first to checkout.');
      navigateTo('login');
      return;
    }

    if (cartItems.length === 0) {
      alert('Your cart is empty.');
      return;
    }

    // Go to checkout page to enter credit card details
    navigateTo('checkout');
  };

  return (
    <Layout navigateTo={navigateTo}>
      <div className="cart-wrapper">
        <h1 className="cart-title">Your Course Cart</h1>

        {cartItems.length === 0 ? (
          <div className="cart-empty">
            <p>Your cart is currently empty.</p>
            <button
              className="btn-cart-secondary"
              onClick={() => navigateTo('course')}
            >
              Browse Courses
            </button>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-info">
                    <h2 className="cart-item-title">{item.title}</h2>
                    <p className="cart-item-level">{item.level}</p>
                  </div>
                  <div className="cart-item-actions">
                    <span className="cart-item-price">₹{item.price}</span>
                    <button
                      className="btn-cart-remove"
                      onClick={() => handleRemove(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <div className="cart-total">
                <span>Total:</span>
                <span className="cart-total-amount">₹{totalPrice}</span>
              </div>
              <div className="cart-buttons">
                <button
                  className="btn-cart-secondary"
                  onClick={() => navigateTo('course')}
                >
                  Add More Courses
                </button>
                <button
                  className="btn-cart-primary"
                  onClick={handleCheckout}
                >
                  Checkout
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}

export default Cart;


