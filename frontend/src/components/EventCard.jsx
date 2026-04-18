import React from 'react';

const EventCard = ({ event, onEdit, onDelete }) => {
  const getCategoryColor = (cat) => {
    switch (cat?.toLowerCase()) {
      case 'conference': return 'var(--cat-conference)';
      case 'workshop': return 'var(--cat-workshop)';
      case 'birthday': return 'var(--cat-birthday)';
      case 'meeting': return 'var(--cat-meeting)';
      default: return 'var(--cat-other)';
    }
  };

  return (
    <div className="event-card">
      <div className="card-header">
        <span className="category-badge" style={{ backgroundColor: getCategoryColor(event.category) }}>
          {event.category}
        </span>
        <div className="card-actions">
          <button className="action-btn edit" onClick={() => onEdit(event)}>✏️</button>
          <button className="action-btn delete" onClick={() => onDelete(event.id)}>🗑️</button>
        </div>
      </div>
      
      <div className="card-body">
        <h3 className="event-title">{event.title}</h3>
        <p className="event-desc">{event.description}</p>
        
        <div className="event-details">
          <div className="detail-item">
            <span className="icon">📅</span>
            <span>{event.date}</span>
          </div>
          <div className="detail-item">
            <span className="icon">⏰</span>
            <span>{event.time}</span>
          </div>
          <div className="detail-item">
            <span className="icon">📍</span>
            <span>{event.location}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
