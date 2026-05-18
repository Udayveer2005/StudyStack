import React from 'react';
import './ItemCard.css';

/**
 * ItemCard Component (Child Component)
 * Displays a single item in the dashboard
 * Shows item details and action buttons
 */
function ItemCard({ item, onEdit, onDelete }) {
  // Get status badge color based on status
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'status-completed';
      case 'in-progress':
        return 'status-in-progress';
      default:
        return 'status-pending';
    }
  };

  return (
    <div className="item-card">
      <div className="item-card-header">
        <h3 className="item-title">{item.title}</h3>
        <span className={`status-badge ${getStatusColor(item.status)}`}>
          {item.status}
        </span>
      </div>
      <p className="item-description">{item.description}</p>
      <div className="item-card-actions">
        <button onClick={() => onEdit(item)} className="btn-edit">
          Edit
        </button>
        <button onClick={() => onDelete(item.id)} className="btn-delete">
          Delete
        </button>
      </div>
    </div>
  );
}

export default ItemCard;

