import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [items, setItems] = useState([]);
  const [category, setCategory] = useState('Car');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [price, setPrice] = useState('');
  const [condition, setCondition] = useState('');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/items');
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newItem = { category, brand, model, price: Number(price), condition };
    try {
      const response = await fetch('http://localhost:5000/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem)
      });
      if (response.ok) {
        setCategory('Car');
        setBrand('');
        setModel('');
        setPrice('');
        setCondition('');
        fetchItems();
      }
    } catch (error) {
      console.error('Error posting item:', error);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Used Items Marketplace</h1>
        <p>Buy and sell pre‑owned cars, bikes, and more</p>
      </header>

      <main className="main">
        <section className="form-section">
          <h2>Post an Item for Sale</h2>
          <form onSubmit={handleSubmit} className="item-form">
            <div className="form-group">
              <label>Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="Car">Car</option>
                <option value="Bike">Bike</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Brand</label>
              <input type="text" value={brand} onChange={(e) => setBrand(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Model</label>
              <input type="text" value={model} onChange={(e) => setModel(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Price (rupees)</label>
              <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Condition</label>
              <input type="text" value={condition} onChange={(e) => setCondition(e.target.value)} placeholder="e.g., Good, Excellent, Used" required />
            </div>
            <button type="submit" className="submit-btn">List Item</button>
          </form>
        </section>

        <section className="marketplace-section">
          <h2>Available Items</h2>
          <div className="items-grid">
            {items.length === 0 ? (
              <p className="no-items">No items listed yet. Be the first to post!</p>
            ) : (
              items.map((item) => (
                <div key={item._id} className="item-card">
                  <div className="card-category">{item.category}</div>
                  <h3>{item.brand} {item.model}</h3>
                  <p className="card-condition">Condition: {item.condition}</p>
                  <p className="card-price">₹{item.price.toLocaleString()}</p>
                </div>
              ))
            )}
          </div>
        </section>
      </main>

      <footer className="footer">
        made by Atharva Zope(123B1D067)
      </footer>
    </div>
  );
}

export default App;