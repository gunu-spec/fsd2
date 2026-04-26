import React from 'react';

const NoteList = ({ notes, selectedSubject, onDeleteNote }) => {
  const [deletingId, setDeletingId] = React.useState(null);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      setDeletingId(id);
      const result = await onDeleteNote(id);
      setDeletingId(null);
      
      if (!result.success) {
        alert('Failed to delete note. Please try again.');
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!notes || Object.keys(notes).length === 0) {
    return (
      <div className="empty-state">
        <h2>No Notes Found</h2>
        <p>
          {selectedSubject === 'All' 
            ? 'No notes have been added yet. Be the first to share!'
            : `No notes found for "${selectedSubject}". Add some notes to this subject!`}
        </p>
      </div>
    );
  }

  return (
    <div className="note-list">
      <div className="list-header">
        <h2>
          {selectedSubject === 'All' 
            ? '📚 All Notes' 
            : `📚 ${selectedSubject} Notes`}
          <span className="note-count">
            ({Object.values(notes).flat().length} notes)
          </span>
        </h2>
      </div>

      {Object.entries(notes).map(([subject, subjectNotes]) => (
        <div key={subject} className="subject-section">
          <h3 className="subject-title">
            {subject} 
            <span className="subject-count">({subjectNotes.length})</span>
          </h3>
          
          <div className="notes-grid">
            {subjectNotes.map((note) => (
              <div key={note._id} className="note-card">
                <div className="note-header">
                  <h4 className="note-title">{note.title}</h4>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDelete(note._id)}
                    disabled={deletingId === note._id}
                    title="Delete note"
                  >
                    {deletingId === note._id ? 'Deleting...' : '×'}
                  </button>
                </div>
                
                <div className="note-meta">
                  <span className="subject-badge">{note.subject}</span>
                  <span className="date">{formatDate(note.createdAt)}</span>
                </div>
                
                {note.description && (
                  <p className="note-description">{note.description}</p>
                )}
                
                {note.link && (
                  <div className="note-link">
                    <a 
                      href={note.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="link-btn"
                    >
                      🔗 Open Link
                    </a>
                  </div>
                )}
                
                {!note.link && !note.description && (
                  <p className="no-content">No additional content provided</p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default NoteList;