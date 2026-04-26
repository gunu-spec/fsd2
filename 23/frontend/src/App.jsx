import React from 'react';
import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000/api/bookings';

const App = () => {
  console.log('App component mounted');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });

  const [formData, setFormData] = useState({
    customerName: '',
    contactDetails: '',
    itemName: '',
    rentalDurationDays: 1
  });

  const items = [
    { id: 1, name: 'Mountain Bike', description: 'Premium off‑road bicycle' },
    { id: 2, name: 'MacBook Pro', description: '16‑inch, M3 Pro chip' },
    { id: 3, name: 'DSLR Camera', description: 'Canon EOS R5 with lens' },
    { id: 4, name: 'Projector', description: '4K Ultra HD, 3000 lumens' }
  ];

  const fetchBookings = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      showMessage('Failed to load bookings', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        const newBooking = await response.json();
        setBookings([newBooking, ...bookings]);
        setFormData({
          customerName: '',
          contactDetails: '',
          itemName: '',
          rentalDurationDays: 1
        });
        showMessage('Booking successful!', 'success');
      } else {
        throw new Error('Booking failed');
      }
    } catch (error) {
      showMessage('Error submitting booking', 'error');
    }
  };

  return (
    <>
      <div className="container">
        <header>
          <h1>Simple Rental Booking System</h1>
          <p>Book premium items instantly. Manage all your rentals in one place.</p>
        </header>

        {message.text && (
          <div className={message.type}>
            {message.text}
          </div>
        )}

        <div className="content">
          <div className="card">
            <h2>Available Items</h2>
            <div className="items-grid">
              {items.map(item => (
                <div className="item-card" key={item.id}>
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                </div>
              ))}
            </div>

            <h2>New Booking</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Customer Name</label>
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  required
                  placeholder="Enter full name"
                />
              </div>
              <div className="form-group">
                <label>Contact Details</label>
                <input
                  type="text"
                  name="contactDetails"
                  value={formData.contactDetails}
                  onChange={handleChange}
                  required
                  placeholder="Email or phone"
                />
              </div>
              <div className="form-group">
                <label>Select Item</label>
                <select
                  name="itemName"
                  value={formData.itemName}
                  onChange={handleChange}
                  required
                >
                  <option value="">Choose an item</option>
                  {items.map(item => (
                    <option key={item.id} value={item.name}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Rental Duration (days)</label>
                <input
                  type="number"
                  name="rentalDurationDays"
                  min="1"
                  max="30"
                  value={formData.rentalDurationDays}
                  onChange={handleChange}
                  required
                />
              </div>
              <button type="submit" className="btn">
                Confirm Booking
              </button>
            </form>
          </div>

          <div className="card">
            <h2>Booking Records</h2>
            {loading ? (
              <div className="loading">Loading bookings...</div>
            ) : bookings.length === 0 ? (
              <p>No bookings yet.</p>
            ) : (
              <table className="bookings-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Contact</th>
                    <th>Item</th>
                    <th>Duration</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(booking => (
                    <tr key={booking._id}>
                      <td>{booking.customerName}</td>
                      <td>{booking.contactDetails}</td>
                      <td>{booking.itemName}</td>
                      <td>{booking.rentalDurationDays} days</td>
                      <td>{new Date(booking.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      <footer>
        made by Atharva Zope(123B1D067)
      </footer>
    </>
  );
};

export default App;