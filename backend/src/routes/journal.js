// src/routes/journal.js
const express = require('express');
const router = express.Router();
const journalController = require('../controllers/journalController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

// Journal CRUD
router.post('/', journalController.createEntry);
router.get('/', journalController.getAllEntries);
router.get('/stats', journalController.getStats);
router.get('/:id', journalController.getEntry);
router.patch('/:id', journalController.updateEntry);
router.delete('/:id', journalController.deleteEntry);
router.patch('/:id/favorite', journalController.toggleFavorite);

module.exports = router;