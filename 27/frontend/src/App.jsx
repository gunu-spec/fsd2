import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('All');
  const [formData, setFormData] = useState({
    itemName: '', description: '', location: '', contact: '', type: 'Lost'
  });

  useEffect(() => {
    fetchItems();
  }, [filter]);

  const fetchItems = async () => {
    const url = filter === 'All' 
      ? 'http://localhost:5000/api/items' 
      : `http://localhost:5000/api/items?type=${filter}`;
    const res = await axios.get(url);
    setItems(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:5000/api/items', formData);
    fetchItems();
    setFormData({ itemName: '', description: '', location: '', contact: '', type: 'Lost' });
  };

  return (
    <div className="container">
      <h2>Lost & Found System</h2>
      
      <div className="filters">
        <button onClick={() => setFilter('All')}>All</button>
        <button onClick={() => setFilter('Lost')}>Lost</button>
        <button onClick={() => setFilter('Found')}>Found</button>
      </div>

      <form onSubmit={handleSubmit}>
        <input 
          type="text" placeholder="Item Name" value={formData.itemName} 
          onChange={(e) => setFormData({...formData, itemName: e.target.value})} required 
        />
        <input 
          type="text" placeholder="Description" value={formData.description} 
          onChange={(e) => setFormData({...formData, description: e.target.value})} required 
        />
        <input 
          type="text" placeholder="Location" value={formData.location} 
          onChange={(e) => setFormData({...formData, location: e.target.value})} required 
        />
        <input 
          type="text" placeholder="Contact" value={formData.contact} 
          onChange={(e) => setFormData({...formData, contact: e.target.value})} required 
        />
        <select 
          value={formData.type} 
          onChange={(e) => setFormData({...formData, type: e.target.value})}
        >
          <option value="Lost">Lost</option>
          <option value="Found">Found</option>
        </select>
        <button type="submit">Submit Item</button>
      </form>

      <div className="item-list">
        {items.map(item => (
          <div key={item._id} className={`card ${item.type.toLowerCase()}`}>
            <h3>{item.itemName} ({item.type})</h3>
            <p>{item.description}</p>
            <p>Location: {item.location}</p>
            <p>Contact: {item.contact}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;