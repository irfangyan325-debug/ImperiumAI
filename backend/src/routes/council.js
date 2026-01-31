// src/routes/council.js
const express = require('express');
const router = express.Router();
const councilController = require('../controllers/councilController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

// Council debate CRUD
router.post('/', councilController.createDebate);
router.get('/', councilController.getAllDebates);
router.get('/stats', councilController.getStats);
router.get('/:id', councilController.getDebate);
router.delete('/:id', councilController.deleteDebate);

// Save to journal
router.post('/:id/save-journal', councilController.saveToJournal);

module.exports = router;