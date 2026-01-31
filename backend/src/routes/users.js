// src/routes/users.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

// Profile & Settings
router.patch('/profile', userController.updateProfile);
router.patch('/settings', userController.updateSettings);

// Mentor management
router.patch('/mentor', userController.updateMentor);

// Stats & Progress
router.post('/xp', userController.addXP);
router.patch('/energy', userController.updateEnergy);
router.post('/streak', userController.incrementStreak);
router.get('/stats', userController.getStats);

// Reset progress
router.delete('/reset', userController.resetProgress);

module.exports = router;