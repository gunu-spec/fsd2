const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const inquirySchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  email: { type: String, required: true },
  destination: { type: String, required: true },
  travelDate: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Inquiry = mongoose.model('Inquiry', inquirySchema);

app.post('/api/inquiries', async (req, res) => {
  try {
    const { customerName, email, destination, travelDate } = req.body;
    const inquiry = new Inquiry({ customerName, email, destination, travelDate });
    await inquiry.save();
    res.status(201).json(inquiry);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/inquiries', async (req, res) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});