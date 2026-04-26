const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const ComplaintSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  issue: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['Academic', 'Infrastructure', 'Administration', 'Other'],
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Resolved'],
    default: 'Pending'
  }
});

const Complaint = mongoose.model('Complaint', ComplaintSchema);

app.post('/api/complaints', async (req, res) => {
  try {
    const { name, issue, category } = req.body;
    const complaint = new Complaint({ name, issue, category });
    await complaint.save();
    res.status(201).json(complaint);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/complaints', async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ _id: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.patch('/api/complaints/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const complaint = await Complaint.findById(id);
    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }
    complaint.status = complaint.status === 'Pending' ? 'Resolved' : 'Pending';
    await complaint.save();
    res.json(complaint);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;

const startServer = (port) => {
  const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      const nextPort = parseInt(port) + 1;
      if (nextPort > 65535) {
        console.error('No available ports found');
        process.exit(1);
      }
      console.log(`Port ${port} is busy, trying ${nextPort}`);
      startServer(nextPort);
    } else {
      console.error('Server error:', error);
    }
  });
};

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    startServer(PORT);
  })
  .catch((error) => {
    console.error('Database connection failed:', error);
  });