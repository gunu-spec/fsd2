import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [appointments, setAppointments] = useState([])
  const [form, setForm] = useState({
    customerName: '',
    date: '',
    time: '',
    service: ''
  })

  const services = [
    'General Physician',
    'Haircut & Styling',
    'Financial Consultation',
    'Dental Checkup'
  ]

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/appointments')
      const data = await res.json()
      setAppointments(data)
    } catch (error) {
      console.error(error)
    }
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch('http://localhost:5000/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      if (res.ok) {
        const newAppointment = await res.json()
        setAppointments([...appointments, newAppointment])
        setForm({ customerName: '', date: '', time: '', service: '' })
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Appointment Booking</h1>
        <p>Schedule your appointment with ease and precision</p>
      </header>

      <div className="container">
        <div className="booking-section">
          <div className="services-panel">
            <h2>Available Services</h2>
            <ul>
              {services.map((service, idx) => (
                <li key={idx}>{service}</li>
              ))}
            </ul>
          </div>

          <div className="form-panel">
            <h2>Book an Appointment</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Customer Name</label>
                <input
                  type="text"
                  name="customerName"
                  value={form.customerName}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name"
                />
              </div>
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Time</label>
                <input
                  type="time"
                  name="time"
                  value={form.time}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Service</label>
                <select
                  name="service"
                  value={form.service}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a service</option>
                  {services.map((service, idx) => (
                    <option key={idx} value={service}>{service}</option>
                  ))}
                </select>
              </div>
              <button type="submit" className="submit-btn">Book Appointment</button>
            </form>
          </div>
        </div>

        <div className="dashboard-section">
          <h2>Booked Appointments</h2>
          <div className="appointments-grid">
            {appointments.length === 0 ? (
              <p className="empty">No appointments booked yet.</p>
            ) : (
              appointments.map((apt) => (
                <div className="appointment-card" key={apt._id}>
                  <div className="card-header">
                    <span className="service-badge">{apt.service}</span>
                    <span className="date">{apt.date}</span>
                  </div>
                  <div className="card-body">
                    <h3>{apt.customerName}</h3>
                    <p className="time">{apt.time}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <footer className="footer">
        made by Atharva Zope(123B1D067)
      </footer>
    </div>
  )
}

export default App