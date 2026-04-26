import { useState, useEffect } from 'react'

function App() {
  const [feedbacks, setFeedbacks] = useState([])
  const [studentName, setStudentName] = useState('')
  const [subject, setSubject] = useState('')
  const [feedbackText, setFeedbackText] = useState('')
  const [loading, setLoading] = useState(false)

  const fetchFeedbacks = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/feedback')
      const data = await response.json()
      setFeedbacks(data)
    } catch (error) {
      console.error('Error fetching feedbacks:', error)
    }
  }

  useEffect(() => {
    fetchFeedbacks()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!studentName.trim() || !subject.trim() || !feedbackText.trim()) return

    setLoading(true)
    try {
      const response = await fetch('http://localhost:5000/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentName, subject, feedbackText })
      })
      if (response.ok) {
        setStudentName('')
        setSubject('')
        setFeedbackText('')
        fetchFeedbacks()
      }
    } catch (error) {
      console.error('Error submitting feedback:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <header>
        <h1>Feedback Collection System</h1>
        <p>Share your feedback to help us improve</p>
      </header>

      <main>
        <section className="form-section">
          <h2>Submit Your Feedback</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="studentName">Student Name</label>
              <input
                type="text"
                id="studentName"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <select
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              >
                <option value="">Select a subject</option>
                <option value="UI/UX">UI/UX</option>
                <option value="OPERATING SYSTEM">OPERATING SYSTEM</option>
                <option value="DESIGN ANALYSIS OF ALGORITHMS">DESIGN ANALYSIS OF ALGORITHMS</option>
                <option value="IMAGE AND VIDEO PROCESSING">IMAGE AND VIDEO PROCESSING</option>
                <option value="DATA STRUCTURES">DATA STRUCTURES</option>
                <option value="SOFTWARE ENGINEERING">SOFTWARE ENGINEERING</option>
                <option value="FULL STACK">FULL STACK</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="feedbackText">Feedback</label>
              <textarea
                id="feedbackText"
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Write your detailed feedback here..."
                rows="5"
                required
              />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </form>
        </section>

        <section className="feedbacks-section">
          <h2>Recent Feedback Entries</h2>
          {feedbacks.length === 0 ? (
            <p className="no-feedback">No feedback submitted yet. Be the first!</p>
          ) : (
            <div className="feedbacks-grid">
              {feedbacks.map((feedback) => (
                <div className="feedback-card" key={feedback._id}>
                  <div className="card-header">
                    <h3>{feedback.studentName}</h3>
                    <span className="subject-badge">{feedback.subject}</span>
                  </div>
                  <p className="feedback-text">{feedback.feedbackText}</p>
                  <div className="card-footer">
                    <small>{new Date(feedback.createdAt).toLocaleDateString()}</small>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer>
        <p>made by Atharva Zope(123B1D067)</p>
      </footer>
    </div>
  )
}

export default App