import React, { useState, useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import EventList from './components/EventList';
import EventForm from './components/EventForm';
import DeleteConfirmation from './components/DeleteConfirmation';

// Amplify Data Client
import { generateClient } from 'aws-amplify/data';
const client = generateClient();

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
      // Amplify Data Fetch
      const { data: items, errors } = await client.models.Event.list();
      if (errors) throw new Error(errors[0].message);
      
      // Sort in memory (DynamoDB list is not sorted by default)
      const sortedEvents = [...items].sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}`);
        const dateB = new Date(`${b.date}T${b.time}`);
        return dateA - dateB;
      });

      setEvents(sortedEvents);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Connection to cloud database failed. Ensure you are logged into AWS and the backend is deployed.');
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
      if (eventToEdit) {
        // Amplify Update
        const { errors } = await client.models.Event.update({
          id: eventToEdit.id,
          ...formData
        });
        if (errors) throw new Error(errors[0].message);
      } else {
        // Amplify Create
        const { errors } = await client.models.Event.create(formData);
        if (errors) throw new Error(errors[0].message);
      }
      
      fetchEvents();
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error saving event:', error);
      alert('Error saving event: ' + error.message);
    }
  };

  const confirmDelete = async () => {
    try {
      // Amplify Delete
      const { errors } = await client.models.Event.delete({ id: eventIdToDelete });
      if (errors) throw new Error(errors[0].message);

      fetchEvents();
      setIsDeleteOpen(false);
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Error deleting event: ' + error.message);
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
