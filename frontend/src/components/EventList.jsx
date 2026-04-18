import React from 'react';
import EventCard from './EventCard';

const EventList = ({ events, onEdit, onDelete }) => {
  if (events.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📂</div>
        <h2>No Events Found</h2>
      </div>
    );
  }

  return (
    <div className="event-grid">
      {events.map((event) => (
        <EventCard 
          key={event.id} 
          event={event} 
          onEdit={onEdit} 
          onDelete={onDelete} 
        />
      ))}
    </div>
  );
};

export default EventList;
