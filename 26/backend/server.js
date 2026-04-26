const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./db');
const noteRoutes = require('./routes/notes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/notes', noteRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Notes Sharing API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});