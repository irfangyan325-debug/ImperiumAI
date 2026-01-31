// src/controllers/mentorController.js
const db = require('../config/database');
const { AppError, catchAsync } = require('../middleware/errorHandler');

// Get all mentors
exports.getAllMentors = catchAsync(async (req, res, next) => {
  const [mentors] = await db.query(
    'SELECT * FROM mentors ORDER BY id'
  );

  res.status(200).json({
    status: 'success',
    results: mentors.length,
    data: {
      mentors
    }
  });
});

// Get single mentor by ID
exports.getMentor = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const [mentors] = await db.query(
    'SELECT * FROM mentors WHERE id = ?',
    [id]
  );

  if (mentors.length === 0) {
    return next(new AppError('Mentor not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      mentor: mentors[0]
    }
  });
});

// Get mentor messages (mock for now - can integrate AI later)
exports.getMentorMessages = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  // Verify mentor exists
  const [mentors] = await db.query(
    'SELECT * FROM mentors WHERE id = ?',
    [id]
  );

  if (mentors.length === 0) {
    return next(new AppError('Mentor not found', 404));
  }

  // Mock message response (replace with AI API later)
  const mockMessages = {
    machiavelli: {
      principle: 'Power is seized, not granted.',
      analysis: 'Your situation requires careful assessment of who holds leverage and who can be influenced.',
      directive: 'Identify the key players, map their interests, and position yourself strategically.'
    },
    napoleon: {
      principle: 'Victory belongs to the decisive.',
      analysis: 'Hesitation is your enemy. The battlefield rewards those who act with conviction.',
      directive: 'Take immediate action. Commit fully and execute with overwhelming force.'
    },
    aurelius: {
      principle: 'Control yourself, not the world.',
      analysis: 'External circumstances are beyond your control, but your response is entirely yours.',
      directive: 'Begin with your morning ritual. Discipline precedes all victory.'
    }
  };

  res.status(200).json({
    status: 'success',
    data: {
      mentor: mentors[0],
      message: mockMessages[id] || {
        principle: 'Wisdom comes through action.',
        analysis: 'Reflect on your situation carefully.',
        directive: 'Take the first step today.'
      }
    }
  });
});