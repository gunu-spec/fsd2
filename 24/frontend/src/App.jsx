import { useState, useEffect } from 'react';

function App() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    studentName: '',
    course: '',
    rating: 5,
    comments: ''
  });

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/feedback');
      if (!response.ok) throw new Error('Failed to fetch feedback');
      const data = await response.json();
      setFeedbacks(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rating' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to submit feedback');
      
      const newFeedback = await response.json();
      setFeedbacks(prev => [newFeedback, ...prev]);
      setSuccess(true);
      setFormData({
        studentName: '',
        course: '',
        rating: 5,
        comments: ''
      });
      
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const renderStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Student Feedback Review System</h1>
        <p>A premium platform for collecting and reviewing student feedback with elegant design and seamless experience.</p>
      </header>

      <div className="container">
        <section className="form-section">
          <h2 className="section-title">Submit Your Feedback</h2>
          
          {success && (
            <div className="success-message">
              Thank you! Your feedback has been submitted successfully.
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="studentName">Student Name</label>
              <input
                type="text"
                id="studentName"
                name="studentName"
                className="form-control"
                value={formData.studentName}
                onChange={handleInputChange}
                required
                placeholder="Enter your full name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="course">Course</label>
              <input
                type="text"
                id="course"
                name="course"
                className="form-control"
                value={formData.course}
                onChange={handleInputChange}
                required
                placeholder="e.g., DAA, FSD, OS, DBMS, etc."
              />
            </div>

            <div className="form-group">
              <label htmlFor="rating">Rating (1-5)</label>
              <select
                id="rating"
                name="rating"
                className="form-control"
                value={formData.rating}
                onChange={handleInputChange}
                required
              >
                <option value="5">5 - Excellent</option>
                <option value="4">4 - Very Good</option>
                <option value="3">3 - Good</option>
                <option value="2">2 - Fair</option>
                <option value="1">1 - Poor</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="comments">Comments</label>
              <textarea
                id="comments"
                name="comments"
                className="form-control"
                value={formData.comments}
                onChange={handleInputChange}
                required
                placeholder="Share your detailed feedback about the course..."
              />
            </div>

            <button type="submit" className="submit-btn">
              Submit Feedback
            </button>
          </form>
        </section>

        <section className="feedbacks-section">
          <h2 className="section-title">Recent Feedback</h2>
          
          {loading && <div className="loading">Loading feedback...</div>}
          {error && <div className="error">Error: {error}</div>}
          
          {!loading && !error && feedbacks.length === 0 && (
            <div className="empty-state">
              <p>No feedback submitted yet. Be the first to share your thoughts!</p>
            </div>
          )}

          {!loading && !error && feedbacks.length > 0 && (
            <div className="feedbacks-grid">
              {feedbacks.map((feedback) => (
                <div key={feedback._id} className="feedback-card">
                  <div className="feedback-header">
                    <div className="student-name">{feedback.studentName}</div>
                    <div className="course">{feedback.course}</div>
                  </div>
                  
                  <div className="rating">
                    <div className="stars">{renderStars(feedback.rating)}</div>
                    <div className="rating-value">{feedback.rating}/5</div>
                  </div>
                  
                  <div className="comments">{feedback.comments}</div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <footer className="footer">
        made by Atharva Zope(123B1D067)
      </footer>
    </div>
  );
}

export default App;