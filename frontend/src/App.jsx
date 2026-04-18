import React, { useState, useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import EventList from './components/EventList';
import EventForm from './components/EventForm';
import DeleteConfirmation from './components/DeleteConfirmation';

// Backend hosted on Render.com (free tier — may need a cold-start wake-up)
const API_URL = import.meta.env.VITE_API_URL || 'https://evently-backend-9dpq.onrender.com/api/events';
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 10000; // 10s between retries (Render cold start ~30s)

function App() {
  const [events, setEvents] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState(null);
  const [eventIdToDelete, setEventIdToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusMsg, setStatusMsg] = useState('Loading events...');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async (attempt = 1) => {
    setLoading(true);
    setError(null);
    if (attempt === 1) setStatusMsg('Connecting to backend...');
    else setStatusMsg(`Backend is waking up... (attempt ${attempt}/${MAX_RETRIES}). Please wait ☕`);

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000); // 15s timeout per attempt
      const response = await fetch(API_URL, { signal: controller.signal });
      clearTimeout(timeout);

      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      const data = await response.json();
      setEvents(data);
      setStatusMsg('Loading events...');
    } catch (err) {
      console.error(`Attempt ${attempt} failed:`, err);
      if (attempt < MAX_RETRIES) {
        setStatusMsg(`Backend is waking up (attempt ${attempt}/${MAX_RETRIES})... retrying in 10s ☕`);
        setTimeout(() => fetchEvents(attempt + 1), RETRY_DELAY_MS);
        return; // keep loading=true during retry
      }
      setError(
        'Cannot connect to the backend. The server may still be waking up — ' +
        'please click "Retry Connection" in ~30 seconds.'
      );
    } finally {
      // Only stop loading if we are NOT scheduling a retry
      if (attempt >= MAX_RETRIES || !error) setLoading(false);
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
          <div className="loader">{statusMsg}</div>
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
