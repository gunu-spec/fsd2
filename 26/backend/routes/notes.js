const express = require('express');
const router = express.Router();
const Note = require('../models/Note');

// Get all notes grouped by subject
router.get('/', async (req, res) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });
    
    // Group notes by subject
    const groupedNotes = notes.reduce((acc, note) => {
      const subject = note.subject;
      if (!acc[subject]) {
        acc[subject] = [];
      }
      acc[subject].push(note);
      return acc;
    }, {});
    
    res.json({
      success: true,
      notes: groupedNotes,
      totalNotes: notes.length,
      subjects: Object.keys(groupedNotes)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to fetch notes' });
  }
});

// Get all subjects
router.get('/subjects', async (req, res) => {
  try {
    const subjects = await Note.distinct('subject');
    res.json({ success: true, subjects });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to fetch subjects' });
  }
});

// Create a new note
router.post('/', async (req, res) => {
  try {
    const { subject, title, link, description } = req.body;
    
    // Validate required fields
    if (!subject || !title) {
      return res.status(400).json({ 
        success: false, 
        error: 'Subject and title are required' 
      });
    }
    
    const newNote = new Note({
      subject,
      title,
      link: link || '',
      description: description || ''
    });
    
    const savedNote = await newNote.save();
    
    res.status(201).json({
      success: true,
      message: 'Note created successfully',
      note: savedNote
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to create note' });
  }
});

// Get notes by subject
router.get('/subject/:subject', async (req, res) => {
  try {
    const { subject } = req.params;
    const notes = await Note.find({ subject }).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      subject,
      notes,
      count: notes.length
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to fetch notes by subject' });
  }
});

// Update a note
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { subject, title, link, description } = req.body;
    
    const updatedNote = await Note.findByIdAndUpdate(
      id,
      { subject, title, link, description },
      { new: true, runValidators: true }
    );
    
    if (!updatedNote) {
      return res.status(404).json({ success: false, error: 'Note not found' });
    }
    
    res.json({
      success: true,
      message: 'Note updated successfully',
      note: updatedNote
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to update note' });
  }
});

// Delete a note
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedNote = await Note.findByIdAndDelete(id);
    
    if (!deletedNote) {
      return res.status(404).json({ success: false, error: 'Note not found' });
    }
    
    res.json({
      success: true,
      message: 'Note deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to delete note' });
  }
});

module.exports = router;