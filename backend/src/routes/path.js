// src/routes/path.js
const express = require('express');
const router = express.Router();
const pathController = require('../controllers/pathController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

// Path progression
router.get('/', pathController.getUserPath);
router.get('/:nodeId', pathController.getNode);
router.patch('/:nodeId/quest/:questId', pathController.updateQuest);
router.post('/reset', pathController.resetPath);

module.exports = router;