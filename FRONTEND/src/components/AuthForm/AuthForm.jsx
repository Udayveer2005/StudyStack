import React from 'react';
import './AuthForm.css';

/**
 * AuthForm Component (Child Component)
 * Reusable form component for Login and SignUp pages
 * Receives form fields, handlers, and button text as props
 */
function AuthForm({
  title,
  subtitle,
  formFields,
  onSubmit,
  error,
  loading,
  buttonText,
  footerLinks
}) {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">{title}</h2>
        <p className="auth-subtitle">{subtitle}</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={onSubmit} className="auth-form">
          {formFields.map((field, index) => (
            <div key={index} className="form-group">
              <label htmlFor={field.id}>{field.label}</label>
              {field.type === 'select' ? (
                <select
                  id={field.id}
                  name={field.name}
                  value={field.value}
                  onChange={field.onChange}
                  required={field.required}
                >
                  {(field.options || []).map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  id={field.id}
                  name={field.name}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder={field.placeholder}
                  required={field.required}
                />
              )}
            </div>
          ))}

          <button type="submit" className="btn-auth" disabled={loading}>
            {loading ? 'Processing...' : buttonText}
          </button>
        </form>

        {footerLinks && (
          <div className="auth-footer">
            {footerLinks.map((link, index) => (
              <p key={index} className="auth-link">
                {link.text} <span onClick={link.onClick} className="auth-link-clickable">{link.label}</span>
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AuthForm;

