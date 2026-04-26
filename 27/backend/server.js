const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Item = require('./models/Item');

const app = express();

// --- Middleware ---
app.use(cors());
app.use(express.json()); // Parses incoming JSON payloads

// --- Database Connection ---
// Using 127.0.0.1 is safer than localhost for Node 17+
const MONGO_URI = 'mongodb://127.0.0.1:27017/lostAndFoundDB';

mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB Connected Locally'))
    .catch(err => console.log('Database Connection Error:', err));

// --- Routes ---

// 1. POST: Create a new Lost/Found item
app.post('/api/items', async (req, res) => {
    try {
        const newItem = new Item(req.body);
        const savedItem = await newItem.save();
        res.status(201).json(savedItem); // 201 Created
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error saving item", error });
    }
});

// 2. GET: Fetch items (with optional filter)
app.get('/api/items', async (req, res) => {
    try {
        // If the URL is /api/items?type=Lost, req.query.type is 'Lost'
        // If there's no query, the filter object is empty {}, fetching everything
        const filter = req.query.type ? { type: req.query.type } : {};
        
        // .sort({ date: -1 }) brings the newest items to the top
        const items = await Item.find(filter).sort({ date: -1 }); 
        res.status(200).json(items);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching items", error });
    }
});

// --- Start Server ---
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});