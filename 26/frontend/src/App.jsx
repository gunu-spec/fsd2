import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import NoteForm from './components/NoteForm';
import NoteList from './components/NoteList';
import SubjectFilter from './components/SubjectFilter';

function App() {
  const [notes, setNotes] = useState({});
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = '/api';

  useEffect(() => {
    fetchNotes();
    fetchSubjects();
  }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/notes`);
      setNotes(response.data.notes);
      setError(null);
    } catch (err) {
      console.error('Error fetching notes:', err);
      setError('Failed to load notes. Please check if the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/notes/subjects`);
      setSubjects(response.data.subjects);
    } catch (err) {
      console.error('Error fetching subjects:', err);
    }
  };

  const handleAddNote = async (newNote) => {
    try {
      await axios.post(`${API_BASE_URL}/notes`, newNote);
      fetchNotes();
      fetchSubjects();
      return { success: true };
    } catch (err) {
      console.error('Error adding note:', err);
      return { success: false, error: 'Failed to add note' };
    }
  };

  const handleDeleteNote = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/notes/${id}`);
      fetchNotes();
      fetchSubjects();
      return { success: true };
    } catch (err) {
      console.error('Error deleting note:', err);
      return { success: false, error: 'Failed to delete note' };
    }
  };

  const filteredNotes = selectedSubject === 'All' 
    ? notes 
    : { [selectedSubject]: notes[selectedSubject] || [] };

  return (
    <div className="app">
      <header className="app-header">
        <h1>📚 Notes Sharing Hub</h1>
        <p className="tagline">Share, organize, and discover educational notes</p>
      </header>

      <main className="app-main">
        <div className="app-container">
          <div className="sidebar">
            <NoteForm onAddNote={handleAddNote} subjects={subjects} />
            <SubjectFilter 
              subjects={subjects} 
              selectedSubject={selectedSubject}
              onSelectSubject={setSelectedSubject}
            />
          </div>

          <div className="main-content">
            {loading ? (
              <div className="loading">Loading notes...</div>
            ) : error ? (
              <div className="error-message">
                <p>{error}</p>
                <button onClick={fetchNotes} className="retry-btn">Retry</button>
              </div>
            ) : (
              <NoteList 
                notes={filteredNotes} 
                selectedSubject={selectedSubject}
                onDeleteNote={handleDeleteNote}
              />
            )}
          </div>
        </div>
      </main>

      <footer className="app-footer">
        <p>Notes Sharing App • Built with React, Express & MongoDB</p>
      </footer>
    </div>
  );
}

export default App;
