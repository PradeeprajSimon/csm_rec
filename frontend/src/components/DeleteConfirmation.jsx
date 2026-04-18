import React from 'react';

const DeleteConfirmation = ({ isOpen, onCancel, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content delete-modal" onClick={e => e.stopPropagation()}>
        <div className="delete-icon">⚠️</div>
        <h3>Delete Event?</h3>
        <p>This action cannot be undone. Are you sure you want to delete this event?</p>
        
        <div className="form-actions delete-actions">
          <button className="btn-outline" onClick={onCancel}>Cancel</button>
          <button className="btn-danger" onClick={onConfirm}>Yes, Delete</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmation;
