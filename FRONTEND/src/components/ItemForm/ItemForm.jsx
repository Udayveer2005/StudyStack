import React from 'react';
import './ItemForm.css';

/**
 * ItemForm Component (Child Component)
 * Reusable form for adding and editing items
 * Used by Dashboard component
 */
function ItemForm({ 
  formData, 
  onChange, 
  onSubmit, 
  onCancel, 
  submitButtonText = 'Submit',
  isEditing = false 
}) {
  return (
    <div className="item-form-overlay">
      <div className="item-form-card">
        <h3>{isEditing ? 'Edit Item' : 'Add New Item'}</h3>
        <form onSubmit={onSubmit} className="item-form">
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={onChange}
              placeholder="Enter item title"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={onChange}
              placeholder="Enter item description"
              rows="4"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={onChange}
              required
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="form-buttons">
            <button type="submit" className="btn-submit">
              {submitButtonText}
            </button>
            <button type="button" onClick={onCancel} className="btn-cancel">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ItemForm;

