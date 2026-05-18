/**
 * SignUp Page (Register)
 * =====================
 * New user registration. Uses getUsers() to check if username/email already exists,
 * then registerUser() to call backend POST /register and create the account.
 * On success we redirect to the login page.
 */
import React, { useState } from 'react';
import AuthForm from '../components/AuthForm/AuthForm.jsx';
import Layout from '../components/Layout/Layout.jsx';
import { getUsers, registerUser } from '../api/api';

function SignUp({ navigateTo }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  /**
   * Handle input changes in the form
   */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    setError('');
  };

  /**
   * Handle form submission
   * Validates inputs and creates a new user account
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation: Check if all fields are filled
    if (!formData.username || !formData.email || !formData.password) {
      setError('Please fill in all fields!');
      setLoading(false);
      return;
    }

    // Validation: Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!');
      setLoading(false);
      return;
    }

    // Strong password validation:
    // - At least 8 characters
    // - At least one uppercase letter
    // - At least one lowercase letter
    // - At least one digit
    // - At least one special character
    const password = formData.password;
    const hasMinLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);

    if (!hasMinLength || !hasUpper || !hasLower || !hasNumber || !hasSpecial) {
      setError(
        'Password must be at least 8 characters and include uppercase, lowercase, number, and special character.'
      );
      setLoading(false);
      return;
    }

    try {
      // API call 1: GET /users - check if username or email is already taken
      const users = await getUsers();
      const userExists = users.find(
        (user) =>
          user.username === formData.username || user.email === formData.email
      );

      if (userExists) {
        setError('Username or email already exists!');
        setLoading(false);
        return;
      }

      // API call 2: POST /register - create the new user on the backend
      await registerUser({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        roles: formData.role === 'teacher' ? ['teacher'] : ['student'],
      });

      alert('Account created successfully! Please login to continue.');
      navigateTo('login');
    } catch (err) {
      setError(err.message || 'Failed to create account. Please try again.');
      console.error('Signup error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Prepare form fields for AuthForm component
  const formFields = [
    {
      id: 'username',
      name: 'username',
      type: 'text',
      label: 'Username',
      value: formData.username,
      onChange: handleChange,
      placeholder: 'Enter your username',
      required: true
    },
    {
      id: 'email',
      name: 'email',
      type: 'email',
      label: 'Email',
      value: formData.email,
      onChange: handleChange,
      placeholder: 'Enter your email',
      required: true
    },
    {
      id: 'password',
      name: 'password',
      type: 'password',
      label: 'Password',
      value: formData.password,
      onChange: handleChange,
      placeholder: 'Min 8 chars, include A–Z, a–z, 0–9 & special character',
      required: true
    },
    {
      id: 'role',
      name: 'role',
      type: 'select',
      label: 'Account Type',
      value: formData.role,
      onChange: handleChange,
      required: true,
      options: [
        { value: 'student', label: 'Student' },
        { value: 'teacher', label: 'Teacher' }
      ]
    },
    {
      id: 'confirmPassword',
      name: 'confirmPassword',
      type: 'password',
      label: 'Confirm Password',
      value: formData.confirmPassword,
      onChange: handleChange,
      placeholder: 'Confirm your password',
      required: true
    }
  ];

  // Prepare footer links for AuthForm component
  const footerLinks = [
    {
      text: 'Already have an account?',
      label: 'Login here',
      onClick: () => navigateTo('login')
    },
    {
      text: '',
      label: 'Back to Home',
      onClick: () => navigateTo('home')
    }
  ];

  return (
    <Layout navigateTo={navigateTo}>
      <AuthForm
        title="Create Account"
        subtitle="Join StudyStack today"
        formFields={formFields}
        onSubmit={handleSubmit}
        error={error}
        loading={loading}
        buttonText="Sign Up"
        footerLinks={footerLinks}
      />
    </Layout>
  );
}

export default SignUp;

