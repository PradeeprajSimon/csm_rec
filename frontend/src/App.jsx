import React, { useState, useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import EventList from './components/EventList';
import EventForm from './components/EventForm';
import DeleteConfirmation from './components/DeleteConfirmation';

// PRODUCTION: Replace the URL below with your Render backend URL after deploying it
// e.g. https://evently-backend.onrender.com/api/events
const API_URL = import.meta.env.VITE_API_URL || 'https://evently-backend.onrender.com/api/events';

function App() {
  const [events, setEvents] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState(null);
  const [eventIdToDelete, setEventIdToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Failed to fetch events');
      const data = await response.json();
      setEvents(data);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Cannot connect to the backend. Please check your API URL.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    setEventToEdit(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (event) => {
    setEventToEdit(event);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (id) => {
    setEventIdToDelete(id);
    setIsDeleteOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      const method = eventToEdit ? 'PUT' : 'POST';
      const url = eventToEdit ? `${API_URL}/${eventToEdit.id}` : API_URL;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        fetchEvents();
        setIsFormOpen(false);
      }
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`${API_URL}/${eventIdToDelete}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchEvents();
        setIsDeleteOpen(false);
      }
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  return (
    <div className="App">
      <Navbar onAddClick={handleAddClick} />

      <main className="container">
        <header className="page-header">
          <h2>Upcoming Events</h2>
          <p>You have {events.length} planned {events.length === 1 ? 'event' : 'events'}.</p>
        </header>

        {error ? (
          <div className="error-state">
            <div className="error-icon">🔌</div>
            <p>{error}</p>
            <button className="btn-outline" onClick={fetchEvents}>Retry Connection</button>
          </div>
        ) : loading ? (
          <div className="loader">Loading events...</div>
        ) : (
          <EventList
            events={events}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
          />
        )}
      </main>

      <EventForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        eventToEdit={eventToEdit}
      />

      <DeleteConfirmation
        isOpen={isDeleteOpen}
        onCancel={() => setIsDeleteOpen(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}

export default App;
