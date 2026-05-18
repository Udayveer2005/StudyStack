/**
 * Checkout Page
 * =============
 * Simulated payment: user enters card details; on submit we call POST /enroll for each
 * course in the cart to record the enrollment on the backend. Then we clear the cart
 * and redirect to dashboard. User must be logged in (ProtectedRoute in App).
 */
import React, { useState } from 'react';
import Layout from '../components/Layout/Layout.jsx';
import { enrollUser } from '../api/api';
import './Checkout.css';

function Checkout({ navigateTo, cartItems, setCartItems }) {
  const [formData, setFormData] = useState({
    nameOnCard: '',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { nameOnCard, cardNumber, expiryMonth, expiryYear, cvv } = formData;

    if (!nameOnCard || !cardNumber || !expiryMonth || !expiryYear || !cvv) {
      setError('Please fill in all fields.');
      return;
    }

    const cardNumberDigits = cardNumber.replace(/\s+/g, '');
    if (!/^\d{16}$/.test(cardNumberDigits)) {
      setError('Card number must be 16 digits.');
      return;
    }

    if (!/^\d{2}$/.test(expiryMonth) || Number(expiryMonth) < 1 || Number(expiryMonth) > 12) {
      setError('Enter a valid expiry month (01–12).');
      return;
    }

    if (!/^\d{2}$/.test(expiryYear)) {
      setError('Enter a valid 2-digit expiry year.');
      return;
    }

    if (!/^\d{3}$/.test(cvv)) {
      setError('CVV must be 3 digits.');
      return;
    }

    if (cartItems.length === 0) {
      setError('Your cart is empty.');
      return;
    }

    const userId = localStorage.getItem('userId');
    if (!userId) {
      setError('Please log in again.');
      return;
    }

    // Enrollment logic: for each course in the cart, call POST /enroll with userId and courseId.
    // The backend adds a row to enrollments.json so we have a record of who bought what.
    try {
      for (const item of cartItems) {
        await enrollUser({ userId: Number(userId), courseId: item.id });
      }
      alert('Payment successful! Thank you for purchasing the courses.');
      setCartItems([]);
      navigateTo('dashboard');
    } catch (err) {
      setError(err.message || 'Enrollment failed. Please try again.');
      console.error(err);
    }
  };

  const handleCancel = () => {
    navigateTo('cart');
  };

  return (
    <Layout navigateTo={navigateTo}>
      <div className="checkout-wrapper">
        <h1 className="checkout-title">Checkout</h1>
        <p className="checkout-subtitle">Enter your credit card details to complete the purchase.</p>

        {error && <div className="checkout-error">{error}</div>}

        <form className="checkout-form" onSubmit={handleSubmit}>
          <div className="checkout-form-group">
            <label htmlFor="nameOnCard">Name on Card</label>
            <input
              id="nameOnCard"
              name="nameOnCard"
              type="text"
              value={formData.nameOnCard}
              onChange={handleChange}
              placeholder="Enter name as on card"
            />
          </div>

          <div className="checkout-form-group">
            <label htmlFor="cardNumber">Card Number</label>
            <input
              id="cardNumber"
              name="cardNumber"
              type="text"
              value={formData.cardNumber}
              onChange={handleChange}
              placeholder="16-digit card number"
            />
          </div>

          <div className="checkout-row">
            <div className="checkout-form-group">
              <label htmlFor="expiryMonth">Expiry Month</label>
              <input
                id="expiryMonth"
                name="expiryMonth"
                type="text"
                value={formData.expiryMonth}
                onChange={handleChange}
                placeholder="MM"
              />
            </div>
            <div className="checkout-form-group">
              <label htmlFor="expiryYear">Expiry Year</label>
              <input
                id="expiryYear"
                name="expiryYear"
                type="text"
                value={formData.expiryYear}
                onChange={handleChange}
                placeholder="YY"
              />
            </div>
            <div className="checkout-form-group">
              <label htmlFor="cvv">CVV</label>
              <input
                id="cvv"
                name="cvv"
                type="password"
                value={formData.cvv}
                onChange={handleChange}
                placeholder="3 digits"
              />
            </div>
          </div>

          <div className="checkout-buttons">
            <button
              type="button"
              className="btn-checkout-secondary"
              onClick={handleCancel}
            >
              Back to Cart
            </button>
            <button
              type="submit"
              className="btn-checkout-primary"
            >
              Pay Now
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}

export default Checkout;


