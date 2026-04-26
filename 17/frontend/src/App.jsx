import React, { useState, useEffect } from 'react';
import './index.css';

function App() {
  const [inquiries, setInquiries] = useState([]);
  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    destination: 'Paris',
    travelDate: ''
  });

  const destinations = [
    { id: 1, name: 'Pune', image: '' },
    { id: 2, name: 'Mumbai', image: '' },
    { id: 3, name: 'Delhi', image: '' },
    { id: 4, name: 'Hyderabad', image: '' }
  ];

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/inquiries');
      const data = await response.json();
      setInquiries(data);
    } catch (error) {
      console.error('Failed to fetch inquiries');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        alert('Inquiry submitted successfully!');
        setFormData({ customerName: '', email: '', destination: 'Pune', travelDate: '' });
        fetchInquiries();
      }
    } catch (error) {
      alert('Failed to submit inquiry');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="app">
      <nav className="navbar">
        <div className="nav-container">
          <h1 className="logo">TravelEase</h1>
          <div className="nav-links">
            <a href="#home">Home</a>
            <a href="#destinations">Destinations</a>
            <a href="#book">Book Now</a>
            <a href="#inquiries">Inquiries</a>
          </div>
        </div>
      </nav>

      <section className="hero" id="home">
        <div className="hero-content">
          <h2>Discover Your Next Adventure</h2>
          <p>Experience the world's most breathtaking destinations with our premium travel services.</p>
          <a href="#book" className="cta-button">Start Your Journey</a>
        </div>
      </section>

      <section className="destinations" id="destinations">
        <h2>Popular Destinations</h2>
        <div className="destinations-grid">
          {destinations.map(dest => (
            <div key={dest.id} className="destination-card">
              <div className="destination-image" style={{ backgroundImage: `url(${dest.image})` }}></div>
              <h3>{dest.name}</h3>
              <p>Experience the beauty and culture of {dest.name} with our curated travel packages.</p>
            </div>
          ))}
        </div>
      </section>

      <section className="booking-form" id="book">
        <h2>Plan Your Trip</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" name="customerName" value={formData.customerName} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Destination</label>
            <select name="destination" value={formData.destination} onChange={handleChange}>
              {destinations.map(dest => (
                <option key={dest.id} value={dest.name}>{dest.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Travel Date</label>
            <input type="date" name="travelDate" value={formData.travelDate} onChange={handleChange} required />
          </div>
          <button type="submit" className="submit-btn">Submit Inquiry</button>
        </form>
      </section>

      <section className="inquiries" id="inquiries">
        <h2>Recent Inquiries</h2>
        <div className="inquiries-list">
          {inquiries.length > 0 ? (
            inquiries.map((inq, index) => (
              <div key={index} className="inquiry-card">
                <h3>{inq.customerName}</h3>
                <p><strong>Destination:</strong> {inq.destination}</p>
                <p><strong>Travel Date:</strong> {new Date(inq.travelDate).toLocaleDateString()}</p>
                <p><strong>Email:</strong> {inq.email}</p>
              </div>
            ))
          ) : (
            <p>No inquiries yet. Be the first to submit!</p>
          )}
        </div>
      </section>

      <footer className="footer">
        <p>made by Atharva Zope(123B1D067)</p>
      </footer>
    </div>
  );
}

export default App;