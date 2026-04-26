const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const feedbackSchema = new mongoose.Schema({
  studentName: {
    type: String,
    required: true
  },
  course: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comments: {
    type: String,
    required: true
  }
}, { timestamps: true });

const Feedback = mongoose.model('Feedback', feedbackSchema);

app.post('/api/feedback', async (req, res) => {
  try {
    const { studentName, course, rating, comments } = req.body;
    const feedback = new Feedback({ studentName, course, rating, comments });
    await feedback.save();
    res.status(201).json(feedback);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/feedback', async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`Port ${PORT} is already in use. Trying port ${Number(PORT) + 1}...`);
    const newPort = Number(PORT) + 1;
    const newServer = app.listen(newPort, () => {
      console.log(`Server running on port ${newPort} (original port ${PORT} was busy)`);
    });
    newServer.on('error', (err) => {
      console.log(`Failed to start server: ${err.message}`);
      console.log('Please free up port 5000 or change PORT in .env file');
    });
  } else {
    console.log(`Server error: ${err.message}`);
  }
});