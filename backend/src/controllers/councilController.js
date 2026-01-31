// src/controllers/councilController.js
const db = require('../config/database');
const { AppError, catchAsync } = require('../middleware/errorHandler');

// Generate mentor responses based on dilemma
const generateMentorResponses = (dilemma) => {
  // Mock responses (replace with AI API later)
  return {
    machiavelli: `Your dilemma reveals a fundamental question of power. Those who hold influence often do so through calculated relationships, not mere authority. Assess who has leverage in this situation - leverage comes from what others need that only you can provide. Do not seek to be loved in this matter; seek to be necessary. Position yourself strategically, identify the weak points in the opposition, and remember: the end justifies the means when power is at stake.`,
    
    napoleon: `This situation demands decisive action, not endless deliberation. Analysis without execution is paralysis. You must commit fully to a course of action and strike with overwhelming force. Half-measures breed half-results. Identify your objective clearly, marshal your resources, and attack the problem at its weakest point. Speed and audacity will carry you further than perfect planning. The battlefield rewards those who act while others hesitate.`,
    
    aurelius: `Your dilemma is an opportunity to practice virtue under pressure. What appears as an external problem is truly a test of your character. You cannot control the actions of others, the circumstances you face, or the outcomes that follow - but you can master your response. Begin with self-discipline: clarify your principles, act in accordance with them, and accept what follows with equanimity. True power lies not in dominating external events, but in maintaining inner sovereignty regardless of circumstance.`
  };
};

// Generate council verdict (synthesis of all three perspectives)
const generateVerdict = (dilemma, responses) => {
  return `The council has deliberated on your dilemma. Machiavelli reminds you that power flows from strategic positioning and leverage - assess who holds what cards and position yourself accordingly. Napoleon calls for decisive action over endless analysis - commit fully and execute with conviction. Aurelius anchors you in virtue and self-command - master your response regardless of external circumstances. Your path forward must balance pragmatic realism with bold action, both grounded in unwavering discipline. The situation demands you understand power dynamics (Machiavelli), act decisively when the moment comes (Napoleon), and maintain your principles throughout (Aurelius). This is the way of the Imperium.`;
};

// Create new council debate
exports.createDebate = catchAsync(async (req, res, next) => {
  const { dilemma } = req.body;

  if (!dilemma || dilemma.trim().length === 0) {
    return next(new AppError('Please provide a dilemma', 400));
  }

  if (dilemma.length < 10) {
    return next(new AppError('Dilemma must be at least 10 characters', 400));
  }

  // Generate mentor responses (mock - replace with AI later)
  const mentorResponses = generateMentorResponses(dilemma);
  
  // Generate verdict
  const verdict = generateVerdict(dilemma, mentorResponses);

  // Save to database
  const [result] = await db.query(
    `INSERT INTO council_debates (user_id, dilemma, mentor_responses, verdict) 
     VALUES (?, ?, ?, ?)`,
    [req.userId, dilemma, JSON.stringify(mentorResponses), verdict]
  );

  // Get created debate
  const [debates] = await db.query(
    'SELECT * FROM council_debates WHERE id = ?',
    [result.insertId]
  );

  const debate = debates[0];
  debate.mentor_responses = JSON.parse(debate.mentor_responses);

  res.status(201).json({
    status: 'success',
    data: {
      debate
    }
  });
});

// Get all user's council debates
exports.getAllDebates = catchAsync(async (req, res, next) => {
  const { limit } = req.query;
  
  let query = 'SELECT * FROM council_debates WHERE user_id = ? ORDER BY created_at DESC';
  const params = [req.userId];

  if (limit) {
    query += ' LIMIT ?';
    params.push(parseInt(limit));
  }

  const [debates] = await db.query(query, params);

  // Parse mentor_responses JSON
  debates.forEach(debate => {
    debate.mentor_responses = JSON.parse(debate.mentor_responses);
  });

  res.status(200).json({
    status: 'success',
    results: debates.length,
    data: {
      debates
    }
  });
});

// Get single council debate
exports.getDebate = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const [debates] = await db.query(
    'SELECT * FROM council_debates WHERE id = ? AND user_id = ?',
    [id, req.userId]
  );

  if (debates.length === 0) {
    return next(new AppError('Council debate not found', 404));
  }

  const debate = debates[0];
  debate.mentor_responses = JSON.parse(debate.mentor_responses);

  res.status(200).json({
    status: 'success',
    data: {
      debate
    }
  });
});

// Delete council debate
exports.deleteDebate = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const [result] = await db.query(
    'DELETE FROM council_debates WHERE id = ? AND user_id = ?',
    [id, req.userId]
  );

  if (result.affectedRows === 0) {
    return next(new AppError('Council debate not found', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

// Get council statistics
exports.getStats = catchAsync(async (req, res, next) => {
  const [stats] = await db.query(
    'SELECT COUNT(*) as total FROM council_debates WHERE user_id = ?',
    [req.userId]
  );

  // Get debates this month
  const [monthStats] = await db.query(
    `SELECT COUNT(*) as count 
     FROM council_debates 
     WHERE user_id = ? AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)`,
    [req.userId]
  );

  // Get most recent debate
  const [recent] = await db.query(
    `SELECT id, dilemma, created_at 
     FROM council_debates 
     WHERE user_id = ? 
     ORDER BY created_at DESC 
     LIMIT 1`,
    [req.userId]
  );

  res.status(200).json({
    status: 'success',
    data: {
      total: stats[0].total || 0,
      thisMonth: monthStats[0].count || 0,
      mostRecent: recent[0] || null
    }
  });
});

// Save council debate to journal
exports.saveToJournal = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  // Get the debate
  const [debates] = await db.query(
    'SELECT * FROM council_debates WHERE id = ? AND user_id = ?',
    [id, req.userId]
  );

  if (debates.length === 0) {
    return next(new AppError('Council debate not found', 404));
  }

  const debate = debates[0];
  const mentorResponses = JSON.parse(debate.mentor_responses);

  // Format content for journal
  const content = `**Your Dilemma:**
${debate.dilemma}

**Machiavelli's Counsel:**
${mentorResponses.machiavelli}

**Napoleon's Counsel:**
${mentorResponses.napoleon}

**Aurelius's Counsel:**
${mentorResponses.aurelius}

**Council Verdict:**
${debate.verdict}`;

  // Create journal entry
  const [result] = await db.query(
    `INSERT INTO journal_entries (user_id, mentor, title, content, tags, is_favorite) 
     VALUES (?, 'council', ?, ?, ?, 0)`,
    [
      req.userId,
      `Council Debate: ${debate.dilemma.substring(0, 50)}...`,
      content,
      JSON.stringify(['council', 'machiavelli', 'napoleon', 'aurelius'])
    ]
  );

  res.status(201).json({
    status: 'success',
    message: 'Council debate saved to journal',
    data: {
      journalEntryId: result.insertId
    }
  });
});