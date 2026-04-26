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

const UsedItemSchema = new mongoose.Schema({
  category: {
    type: String,
    enum: ['Car', 'Bike', 'Other'],
    required: true
  },
  brand: {
    type: String,
    required: true
  },
  model: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  condition: {
    type: String,
    required: true
  }
});

const UsedItem = mongoose.model('UsedItem', UsedItemSchema);

app.post('/api/items', async (req, res) => {
  try {
    const { category, brand, model, price, condition } = req.body;
    const newItem = new UsedItem({ category, brand, model, price, condition });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/items', async (req, res) => {
  try {
    const items = await UsedItem.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});