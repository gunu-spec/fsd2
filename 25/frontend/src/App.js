import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

const PORTS = [5000, 5001, 5002, 5003];
let API_BASE = 'http://localhost:5000';

const tryPorts = async () => {
  for (const port of PORTS) {
    try {
      const response = await fetch(`http://localhost:${port}/api/complaints`, { method: 'HEAD' });
      if (response.ok) {
        return `http://localhost:${port}`;
      }
    } catch (error) {
      continue;
    }
  }
  return 'http://localhost:5000';
};

function App() {
  const [complaints, setComplaints] = useState([]);
  const [name, setName] = useState('');
  const [issue, setIssue] = useState('');
  const [category, setCategory] = useState('Academic');
  const [loading, setLoading] = useState(false);
  const [apiBase, setApiBase] = useState(API_BASE);

  useEffect(() => {
    const detectPort = async () => {
      const base = await tryPorts();
      setApiBase(base);
    };
    detectPort();
  }, []);

  const fetchComplaints = useCallback(async () => {
    try {
      const response = await fetch(`${apiBase}/api/complaints`);
      const data = await response.json();
      setComplaints(data);
    } catch (error) {
      console.error('Error fetching complaints:', error);
    }
  }, [apiBase]);

  useEffect(() => {
    if (apiBase) {
      fetchComplaints();
    }
  }, [apiBase, fetchComplaints]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !issue.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(`${apiBase}/api/complaints`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, issue, category }),
      });
      const newComplaint = await response.json();
      setComplaints([newComplaint, ...complaints]);
      setName('');
      setIssue('');
      setCategory('Academic');
    } catch (error) {
      console.error('Error submitting complaints:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      const response = await fetch(`${apiBase}/api/complaints/${id}`, {
        method: 'PATCH',
      });
      const updatedComplaint = await response.json();
      setComplaints(complaints.map(c =>
        c._id === id ? updatedComplaint : c
      ));
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const getStatusColor = (status) => {
    return status === 'Pending' ? '#f59e0b' : '#10b981';
  };

  const getCategoryColor = (category) => {
    const colors = {
      Academic: '#3b82f6',
      Infrastructure: '#8b5cf6',
      Administration: '#ef4444',
      Other: '#6b7280'
    };
    return colors[category] || '#6b7280';
  };

  return (
    <div className="app">
      <header className="header">
        <h1>College Grievance Portal</h1>
        <p>Submit and manage complaints efficiently</p>
      </header>

      <main className="main-container">
        <div className="dashboard">
          <section className="form-section">
            <div className="card">
              <h2>Submit New Complaint</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="Academic">Academic</option>
                    <option value="Infrastructure">Infrastructure</option>
                    <option value="Administration">Administration</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Issue Description</label>
                  <textarea
                    value={issue}
                    onChange={(e) => setIssue(e.target.value)}
                    placeholder="Describe your issue in detail"
                    rows="4"
                    required
                  />
                </div>
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? 'Submitting...' : 'Submit Complaint'}
                </button>
              </form>
            </div>
          </section>

          <section className="list-section">
            <div className="card">
              <div className="section-header">
                <h2>All Complaints</h2>
                <span className="count-badge">{complaints.length} total</span>
              </div>
              
              {complaints.length === 0 ? (
                <div className="empty-state">
                  <p>No complaints submitted yet.</p>
                </div>
              ) : (
                <div className="complaints-grid">
                  {complaints.map((complaint) => (
                    <div key={complaint._id} className="complaint-card">
                      <div className="complaint-header">
                        <div className="user-info">
                          <span className="avatar">{complaint.name.charAt(0)}</span>
                          <div>
                            <h3>{complaint.name}</h3>
                            <span 
                              className="category-tag"
                              style={{ backgroundColor: getCategoryColor(complaint.category) }}
                            >
                              {complaint.category}
                            </span>
                          </div>
                        </div>
                        <span 
                          className="status-badge"
                          style={{ backgroundColor: getStatusColor(complaint.status) }}
                        >
                          {complaint.status}
                        </span>
                      </div>
                      <p className="issue-text">{complaint.issue}</p>
                      <div className="complaint-footer">
                        <button 
                          className="toggle-btn"
                          onClick={() => toggleStatus(complaint._id, complaint.status)}
                        >
                          Mark as {complaint.status === 'Pending' ? 'Resolved' : 'Pending'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      <footer className="footer">
        <p>College Grievance Portal • Complaint Management System</p>
      </footer>
    </div>
  );
}

export default App;