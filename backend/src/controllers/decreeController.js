// src/controllers/decreeController.js
const db = require('../config/database');
const { AppError, catchAsync } = require('../middleware/errorHandler');

// Create new decree
exports.createDecree = catchAsync(async (req, res, next) => {
  const { title, mentor, description, dueDate, priority } = req.body;

  if (!title || !description) {
    return next(new AppError('Please provide title and description', 400));
  }

  const [result] = await db.query(
    `INSERT INTO decrees (user_id, title, mentor, description, status, priority, due_date) 
     VALUES (?, ?, ?, ?, 'active', ?, ?)`,
    [req.userId, title, mentor || null, description, priority || 'medium', dueDate || null]
  );

  // Get created decree
  const [decrees] = await db.query(
    'SELECT * FROM decrees WHERE id = ?',
    [result.insertId]
  );

  res.status(201).json({
    status: 'success',
    data: {
      decree: decrees[0]
    }
  });
});

// Get all user decrees
exports.getAllDecrees = catchAsync(async (req, res, next) => {
  const { status, mentor } = req.query;

  let query = 'SELECT * FROM decrees WHERE user_id = ?';
  const params = [req.userId];

  // Filter by status
  if (status) {
    query += ' AND status = ?';
    params.push(status);
  }

  // Filter by mentor
  if (mentor) {
    query += ' AND mentor = ?';
    params.push(mentor);
  }

  query += ' ORDER BY created_at DESC';

  const [decrees] = await db.query(query, params);

  res.status(200).json({
    status: 'success',
    results: decrees.length,
    data: {
      decrees
    }
  });
});

// Get single decree
exports.getDecree = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const [decrees] = await db.query(
    'SELECT * FROM decrees WHERE id = ? AND user_id = ?',
    [id, req.userId]
  );

  if (decrees.length === 0) {
    return next(new AppError('Decree not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      decree: decrees[0]
    }
  });
});

// Update decree
exports.updateDecree = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { title, description, status, priority, dueDate } = req.body;

  // Check decree exists and belongs to user
  const [existing] = await db.query(
    'SELECT * FROM decrees WHERE id = ? AND user_id = ?',
    [id, req.userId]
  );

  if (existing.length === 0) {
    return next(new AppError('Decree not found', 404));
  }

  const updates = {};
  if (title !== undefined) updates.title = title;
  if (description !== undefined) updates.description = description;
  if (status !== undefined) updates.status = status;
  if (priority !== undefined) updates.priority = priority;
  if (dueDate !== undefined) updates.due_date = dueDate;

  if (Object.keys(updates).length === 0) {
    return next(new AppError('No fields to update', 400));
  }

  // Build dynamic query
  const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
  const values = [...Object.values(updates), id, req.userId];

  await db.query(
    `UPDATE decrees SET ${fields} WHERE id = ? AND user_id = ?`,
    values
  );

  // Get updated decree
  const [decrees] = await db.query(
    'SELECT * FROM decrees WHERE id = ?',
    [id]
  );

  res.status(200).json({
    status: 'success',
    data: {
      decree: decrees[0]
    }
  });
});

// Delete decree
exports.deleteDecree = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const [result] = await db.query(
    'DELETE FROM decrees WHERE id = ? AND user_id = ?',
    [id, req.userId]
  );

  if (result.affectedRows === 0) {
    return next(new AppError('Decree not found', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

// Get decree statistics
exports.getDecreeStats = catchAsync(async (req, res, next) => {
  const [stats] = await db.query(
    `SELECT 
       COUNT(*) as total,
       SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
       SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active,
       SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending
     FROM decrees WHERE user_id = ?`,
    [req.userId]
  );

  const [mentorStats] = await db.query(
    `SELECT mentor, COUNT(*) as count 
     FROM decrees 
     WHERE user_id = ? AND mentor IS NOT NULL 
     GROUP BY mentor`,
    [req.userId]
  );

  res.status(200).json({
    status: 'success',
    data: {
      total: stats[0].total || 0,
      completed: stats[0].completed || 0,
      active: stats[0].active || 0,
      pending: stats[0].pending || 0,
      byMentor: mentorStats
    }
  });
});