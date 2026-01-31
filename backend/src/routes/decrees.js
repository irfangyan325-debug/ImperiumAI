// src/routes/decrees.js
const express = require('express');
const router = express.Router();
const decreeController = require('../controllers/decreeController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

// Decree CRUD
router.post('/', decreeController.createDecree);
router.get('/', decreeController.getAllDecrees);
router.get('/stats', decreeController.getDecreeStats);
router.get('/:id', decreeController.getDecree);
router.patch('/:id', decreeController.updateDecree);
router.delete('/:id', decreeController.deleteDecree);

module.exports = router;