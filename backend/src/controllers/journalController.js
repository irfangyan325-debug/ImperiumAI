// src/controllers/journalController.js
const db = require('../config/database');
const { AppError, catchAsync } = require('../middleware/errorHandler');

// Create journal entry
exports.createEntry = catchAsync(async (req, res, next) => {
  const { mentor, title, content, tags } = req.body;

  if (!title || !content) {
    return next(new AppError('Please provide title and content', 400));
  }

  const tagsJson = tags ? JSON.stringify(tags) : JSON.stringify([]);

  const [result] = await db.query(
    `INSERT INTO journal_entries (user_id, mentor, title, content, tags, is_favorite) 
     VALUES (?, ?, ?, ?, ?, 0)`,
    [req.userId, mentor || null, title, content, tagsJson]
  );

  // Get created entry
  const [entries] = await db.query(
    'SELECT * FROM journal_entries WHERE id = ?',
    [result.insertId]
  );

  // Parse tags JSON
  const entry = entries[0];
  entry.tags = JSON.parse(entry.tags || '[]');

  res.status(201).json({
    status: 'success',
    data: {
      entry
    }
  });
});

// Get all user journal entries
exports.getAllEntries = catchAsync(async (req, res, next) => {
  const { mentor, search, favorite } = req.query;

  let query = 'SELECT * FROM journal_entries WHERE user_id = ?';
  const params = [req.userId];

  // Filter by mentor
  if (mentor) {
    query += ' AND mentor = ?';
    params.push(mentor);
  }

  // Filter by favorite
  if (favorite === 'true') {
    query += ' AND is_favorite = 1';
  }

  // Search in title and content
  if (search) {
    query += ' AND (title LIKE ? OR content LIKE ?)';
    const searchTerm = `%${search}%`;
    params.push(searchTerm, searchTerm);
  }

  query += ' ORDER BY created_at DESC';

  const [entries] = await db.query(query, params);

  // Parse tags JSON for each entry
  entries.forEach(entry => {
    entry.tags = JSON.parse(entry.tags || '[]');
  });

  res.status(200).json({
    status: 'success',
    results: entries.length,
    data: {
      entries
    }
  });
});

// Get single journal entry
exports.getEntry = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const [entries] = await db.query(
    'SELECT * FROM journal_entries WHERE id = ? AND user_id = ?',
    [id, req.userId]
  );

  if (entries.length === 0) {
    return next(new AppError('Journal entry not found', 404));
  }

  const entry = entries[0];
  entry.tags = JSON.parse(entry.tags || '[]');

  res.status(200).json({
    status: 'success',
    data: {
      entry
    }
  });
});

// Update journal entry
exports.updateEntry = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { title, content, tags, isFavorite } = req.body;

  // Check entry exists and belongs to user
  const [existing] = await db.query(
    'SELECT * FROM journal_entries WHERE id = ? AND user_id = ?',
    [id, req.userId]
  );

  if (existing.length === 0) {
    return next(new AppError('Journal entry not found', 404));
  }

  const updates = {};
  if (title !== undefined) updates.title = title;
  if (content !== undefined) updates.content = content;
  if (tags !== undefined) updates.tags = JSON.stringify(tags);
  if (isFavorite !== undefined) updates.is_favorite = isFavorite ? 1 : 0;

  if (Object.keys(updates).length === 0) {
    return next(new AppError('No fields to update', 400));
  }

  // Build dynamic query
  const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
  const values = [...Object.values(updates), id, req.userId];

  await db.query(
    `UPDATE journal_entries SET ${fields} WHERE id = ? AND user_id = ?`,
    values
  );

  // Get updated entry
  const [entries] = await db.query(
    'SELECT * FROM journal_entries WHERE id = ?',
    [id]
  );

  const entry = entries[0];
  entry.tags = JSON.parse(entry.tags || '[]');

  res.status(200).json({
    status: 'success',
    data: {
      entry
    }
  });
});

// Delete journal entry
exports.deleteEntry = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const [result] = await db.query(
    'DELETE FROM journal_entries WHERE id = ? AND user_id = ?',
    [id, req.userId]
  );

  if (result.affectedRows === 0) {
    return next(new AppError('Journal entry not found', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

// Toggle favorite
exports.toggleFavorite = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  // Get current favorite status
  const [entries] = await db.query(
    'SELECT is_favorite FROM journal_entries WHERE id = ? AND user_id = ?',
    [id, req.userId]
  );

  if (entries.length === 0) {
    return next(new AppError('Journal entry not found', 404));
  }

  const newStatus = entries[0].is_favorite ? 0 : 1;

  await db.query(
    'UPDATE journal_entries SET is_favorite = ? WHERE id = ?',
    [newStatus, id]
  );

  res.status(200).json({
    status: 'success',
    data: {
      isFavorite: newStatus === 1
    }
  });
});

// Get journal statistics
exports.getStats = catchAsync(async (req, res, next) => {
  const [stats] = await db.query(
    `SELECT 
       COUNT(*) as total,
       SUM(CASE WHEN is_favorite = 1 THEN 1 ELSE 0 END) as favorites
     FROM journal_entries WHERE user_id = ?`,
    [req.userId]
  );

  const [mentorStats] = await db.query(
    `SELECT mentor, COUNT(*) as count 
     FROM journal_entries 
     WHERE user_id = ? AND mentor IS NOT NULL 
     GROUP BY mentor`,
    [req.userId]
  );

  // Get entries this week
  const [weekStats] = await db.query(
    `SELECT COUNT(*) as count 
     FROM journal_entries 
     WHERE user_id = ? AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)`,
    [req.userId]
  );

  res.status(200).json({
    status: 'success',
    data: {
      total: stats[0].total || 0,
      favorites: stats[0].favorites || 0,
      thisWeek: weekStats[0].count || 0,
      byMentor: mentorStats
    }
  });
});