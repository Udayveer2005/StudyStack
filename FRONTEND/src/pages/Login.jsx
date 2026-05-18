/**
 * Login Page
 * ==========
 * Renders the login form (via AuthForm) and handles authentication.
 * On submit we call the backend POST /login (via loginUser from api.js).
 * On success we store user id and username in localStorage and redirect to dashboard.
 */
import React, { useState } from 'react';
import AuthForm from '../components/AuthForm/AuthForm.jsx';
import Layout from '../components/Layout/Layout.jsx';
import { loginUser } from '../api/api';

function Login({ navigateTo }) {
  // Form state: controlled inputs for username and password
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'student'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // True while POST /login is in progress

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  /**
   * Form submission: call backend POST /login with username and password.
   * - If successful: backend returns { id, username, email }. We save id and username to localStorage
   *   and navigate to dashboard (ProtectedRoute will allow access because isLoggedIn is set).
   * - If failed: loginUser throws (e.g. invalid credentials); we show err.message in the form.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.username || !formData.password) {
      setError('Please fill in all fields!');
      setLoading(false);
      return;
    }

    try {
      const response = await loginUser({
        username: formData.username,
        password: formData.password,
      });

      const user = response.user || response;
      const isTeacher = Array.isArray(user.roles) && user.roles.includes('teacher');
      if (formData.role === 'teacher' && !isTeacher) {
        setError('This account is not a teacher account.');
        setLoading(false);
        return;
      }

      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userId', user.id.toString());
      localStorage.setItem('username', user.username);
      localStorage.setItem('accessToken', response.accessToken || '');
      localStorage.setItem('role', isTeacher ? 'teacher' : 'student');

      navigateTo(isTeacher ? 'teacher-dashboard' : 'dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
      console.error('Login error:', err);
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
      id: 'role',
      name: 'role',
      type: 'select',
      label: 'Login As',
      value: formData.role,
      onChange: handleChange,
      required: true,
      options: [
        { value: 'student', label: 'Student' },
        { value: 'teacher', label: 'Teacher' }
      ]
    },
    {
      id: 'password',
      name: 'password',
      type: 'password',
      label: 'Password',
      value: formData.password,
      onChange: handleChange,
      placeholder: 'Enter your password',
      required: true
    }
  ];

  // Prepare footer links for AuthForm component
  const footerLinks = [
    {
      text: "Don't have an account?",
      label: 'Sign up here',
      onClick: () => navigateTo('signup')
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
        title="Login"
        subtitle="Welcome back to StudyStack"
        formFields={formFields}
        onSubmit={handleSubmit}
        error={error}
        loading={loading}
        buttonText="Login"
        footerLinks={footerLinks}
      />
    </Layout>
  );
}

export default Login;

