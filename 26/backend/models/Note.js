const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true,
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  link: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  }
}, {
  timestamps: true // Let mongoose handle createdAt and updatedAt automatically
});

const Note = mongoose.model('Note', noteSchema);

module.exports = Note;