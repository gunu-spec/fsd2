import React, { useState } from 'react';

const NoteForm = ({ onAddNote, subjects }) => {
  const [formData, setFormData] = useState({
    subject: '',
    title: '',
    link: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.subject.trim() || !formData.title.trim()) {
      setMessage({ type: 'error', text: 'Subject and Title are required' });
      return;
    }

    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    const result = await onAddNote(formData);
    
    if (result.success) {
      setFormData({
        subject: '',
        title: '',
        link: '',
        description: ''
      });
      setMessage({ type: 'success', text: 'Note added successfully!' });
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to add note' });
    }
    
    setIsSubmitting(false);
    
    // Clear message after 3 seconds
    setTimeout(() => {
      setMessage({ type: '', text: '' });
    }, 3000);
  };

  return (
    <div className="note-form">
      <h2>📝 Add New Note</h2>
      
      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="subject">Subject *</label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="e.g., Mathematics, Physics, Computer Science"
            list="subject-suggestions"
            required
          />
          <datalist id="subject-suggestions">
            {subjects.map((subject, index) => (
              <option key={index} value={subject} />
            ))}
          </datalist>
        </div>

        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Calculus Basics, React Hooks Guide"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="link">Link (Optional)</label>
          <input
            type="url"
            id="link"
            name="link"
            value={formData.link}
            onChange={handleChange}
            placeholder="https://example.com/notes.pdf"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description (Optional)</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Brief description of the note content..."
            rows="3"
          />
        </div>

        <button 
          type="submit" 
          className="submit-btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Adding...' : 'Add Note'}
        </button>
      </form>

      <div className="form-tips">
        <p><strong>Tips:</strong></p>
        <ul>
          <li>Use descriptive titles for better searchability</li>
          <li>Include links to PDFs, Google Docs, or websites</li>
          <li>Group similar notes under the same subject</li>
        </ul>
      </div>
    </div>
  );
};

export default NoteForm;