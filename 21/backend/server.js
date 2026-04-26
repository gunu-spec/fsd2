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

const appointmentSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  service: { type: String, required: true }
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

app.post('/api/appointments', async (req, res) => {
  try {
    const { customerName, date, time, service } = req.body;
    const appointment = new Appointment({ customerName, date, time, service });
    await appointment.save();
    res.status(201).json(appointment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/appointments', async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({ date: 1, time: 1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));