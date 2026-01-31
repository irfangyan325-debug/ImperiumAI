// src/routes/mentors.js
const express = require('express');
const router = express.Router();
const mentorController = require('../controllers/mentorController');

// Public routes (no auth needed to view mentors)
router.get('/', mentorController.getAllMentors);
router.get('/:id', mentorController.getMentor);
router.get('/:id/message', mentorController.getMentorMessages);

module.exports = router;