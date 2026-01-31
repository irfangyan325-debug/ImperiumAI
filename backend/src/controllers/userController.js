// src/controllers/userController.js
const db = require('../config/database');
const { AppError, catchAsync } = require('../middleware/errorHandler');

// Update user profile (name)
exports.updateProfile = catchAsync(async (req, res, next) => {
  const { name } = req.body;

  if (!name || name.trim().length === 0) {
    return next(new AppError('Please provide a valid name', 400));
  }

  await db.query(
    'UPDATE users SET name = ? WHERE id = ?',
    [name.trim(), req.userId]
  );

  // Get updated user
  const [users] = await db.query(
    `SELECT id, name, email, level, xp, streak, goal, energy, 
     selected_mentor_id, active_mentor_id, sound_enabled, 
     notifications_enabled, has_completed_onboarding 
     FROM users WHERE id = ?`,
    [req.userId]
  );

  res.status(200).json({
    status: 'success',
    data: {
      user: users[0]
    }
  });
});

// Update user settings (sound, notifications)
exports.updateSettings = catchAsync(async (req, res, next) => {
  const { soundEnabled, notificationsEnabled } = req.body;

  const updates = {};
  if (soundEnabled !== undefined) updates.sound_enabled = soundEnabled ? 1 : 0;
  if (notificationsEnabled !== undefined) updates.notifications_enabled = notificationsEnabled ? 1 : 0;

  if (Object.keys(updates).length === 0) {
    return next(new AppError('No settings to update', 400));
  }

  // Build dynamic query
  const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
  const values = [...Object.values(updates), req.userId];

  await db.query(
    `UPDATE users SET ${fields} WHERE id = ?`,
    values
  );

  // Get updated user
  const [users] = await db.query(
    `SELECT id, name, email, level, xp, streak, goal, energy, 
     selected_mentor_id, active_mentor_id, sound_enabled, 
     notifications_enabled, has_completed_onboarding 
     FROM users WHERE id = ?`,
    [req.userId]
  );

  res.status(200).json({
    status: 'success',
    data: {
      user: users[0]
    }
  });
});

// Select/Switch mentor
exports.updateMentor = catchAsync(async (req, res, next) => {
  const { mentorId, setAsActive } = req.body;

  if (!mentorId) {
    return next(new AppError('Please provide a mentor ID', 400));
  }

  // Validate mentor exists
  const [mentors] = await db.query(
    'SELECT id FROM mentors WHERE id = ?',
    [mentorId]
  );

  if (mentors.length === 0) {
    return next(new AppError('Invalid mentor ID', 400));
  }

  // Update mentor
  if (setAsActive) {
    // Set as both selected and active
    await db.query(
      'UPDATE users SET selected_mentor_id = ?, active_mentor_id = ? WHERE id = ?',
      [mentorId, mentorId, req.userId]
    );
  } else {
    // Only update active mentor (for switching)
    await db.query(
      'UPDATE users SET active_mentor_id = ? WHERE id = ?',
      [mentorId, req.userId]
    );
  }

  // Get updated user
  const [users] = await db.query(
    `SELECT id, name, email, level, xp, streak, goal, energy, 
     selected_mentor_id, active_mentor_id, sound_enabled, 
     notifications_enabled, has_completed_onboarding 
     FROM users WHERE id = ?`,
    [req.userId]
  );

  res.status(200).json({
    status: 'success',
    data: {
      user: users[0]
    }
  });
});

// Add XP and auto level-up
exports.addXP = catchAsync(async (req, res, next) => {
  const { amount } = req.body;

  if (!amount || amount <= 0) {
    return next(new AppError('Please provide a valid XP amount', 400));
  }

  // Get current user
  const [users] = await db.query(
    'SELECT xp, level FROM users WHERE id = ?',
    [req.userId]
  );

  if (users.length === 0) {
    return next(new AppError('User not found', 404));
  }

  const currentXP = users[0].xp;
  const currentLevel = users[0].level;
  const newXP = currentXP + amount;

  // Calculate new level (1000 XP per level)
  const xpPerLevel = 1000;
  const newLevel = Math.floor(newXP / xpPerLevel) + 1;

  await db.query(
    'UPDATE users SET xp = ?, level = ? WHERE id = ?',
    [newXP, newLevel, req.userId]
  );

  const leveledUp = newLevel > currentLevel;

  res.status(200).json({
    status: 'success',
    data: {
      xp: newXP,
      level: newLevel,
      leveledUp,
      xpGained: amount
    }
  });
});

// Update energy
exports.updateEnergy = catchAsync(async (req, res, next) => {
  const { amount } = req.body;

  if (amount === undefined) {
    return next(new AppError('Please provide energy amount', 400));
  }

  // Get current energy
  const [users] = await db.query(
    'SELECT energy FROM users WHERE id = ?',
    [req.userId]
  );

  const newEnergy = Math.max(0, Math.min(100, users[0].energy + amount));

  await db.query(
    'UPDATE users SET energy = ? WHERE id = ?',
    [newEnergy, req.userId]
  );

  res.status(200).json({
    status: 'success',
    data: {
      energy: newEnergy
    }
  });
});

// Increment streak
exports.incrementStreak = catchAsync(async (req, res, next) => {
  await db.query(
    'UPDATE users SET streak = streak + 1 WHERE id = ?',
    [req.userId]
  );

  const [users] = await db.query(
    'SELECT streak FROM users WHERE id = ?',
    [req.userId]
  );

  res.status(200).json({
    status: 'success',
    data: {
      streak: users[0].streak
    }
  });
});

// Get user statistics
exports.getStats = catchAsync(async (req, res, next) => {
  // Get user data
  const [users] = await db.query(
    `SELECT level, xp, streak, energy, goal, 
     selected_mentor_id, created_at 
     FROM users WHERE id = ?`,
    [req.userId]
  );

  if (users.length === 0) {
    return next(new AppError('User not found', 404));
  }

  const user = users[0];

  // Get decrees count
  const [decreeStats] = await db.query(
    `SELECT 
       COUNT(*) as total,
       SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
       SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active
     FROM decrees WHERE user_id = ?`,
    [req.userId]
  );

  // Get journal entries count
  const [journalStats] = await db.query(
    'SELECT COUNT(*) as total FROM journal_entries WHERE user_id = ?',
    [req.userId]
  );

  // Get council debates count
  const [councilStats] = await db.query(
    'SELECT COUNT(*) as total FROM council_debates WHERE user_id = ?',
    [req.userId]
  );

  // Calculate days active
  const createdAt = new Date(user.created_at);
  const now = new Date();
  const daysActive = Math.floor((now - createdAt) / (1000 * 60 * 60 * 24));

  res.status(200).json({
    status: 'success',
    data: {
      user: {
        level: user.level,
        xp: user.xp,
        streak: user.streak,
        energy: user.energy,
        goal: user.goal,
        selectedMentor: user.selected_mentor_id
      },
      stats: {
        totalDecrees: decreeStats[0].total || 0,
        completedDecrees: decreeStats[0].completed || 0,
        activeDecrees: decreeStats[0].active || 0,
        journalEntries: journalStats[0].total || 0,
        councilSessions: councilStats[0].total || 0,
        daysActive
      }
    }
  });
});

// Reset user data (for testing/reset progress)
exports.resetProgress = catchAsync(async (req, res, next) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // Reset user stats
    await connection.query(
      `UPDATE users 
       SET level = 1, 
           xp = 0, 
           streak = 0, 
           energy = 100, 
           goal = NULL,
           selected_mentor_id = NULL,
           active_mentor_id = NULL,
           has_completed_onboarding = 0
       WHERE id = ?`,
      [req.userId]
    );

    // Delete user's decrees
    await connection.query('DELETE FROM decrees WHERE user_id = ?', [req.userId]);

    // Delete user's journal entries
    await connection.query('DELETE FROM journal_entries WHERE user_id = ?', [req.userId]);

    // Delete user's path nodes
    await connection.query('DELETE FROM path_nodes WHERE user_id = ?', [req.userId]);

    // Delete user's council debates
    await connection.query('DELETE FROM council_debates WHERE user_id = ?', [req.userId]);

    // Delete user's relics
    await connection.query('DELETE FROM relics WHERE user_id = ?', [req.userId]);

    await connection.commit();

    res.status(200).json({
      status: 'success',
      message: 'Progress reset successfully'
    });
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
});