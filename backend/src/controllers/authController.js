// src/controllers/authController.js
const bcrypt = require('bcryptjs');
const db = require('../config/database');
const { AppError, catchAsync } = require('../middleware/errorHandler');
const { createSendToken } = require('../utils/jwt');

// Register new user
exports.register = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;

  // 1) Validate input
  if (!name || !email || !password) {
    return next(new AppError('Please provide name, email and password', 400));
  }

  if (password.length < 6) {
    return next(new AppError('Password must be at least 6 characters', 400));
  }

  // 2) Check if email already exists
  const [existingUsers] = await db.query(
    'SELECT id FROM users WHERE email = ?',
    [email]
  );

  if (existingUsers.length > 0) {
    return next(new AppError('Email already registered', 400));
  }

  // 3) Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  // 4) Create user
  const [result] = await db.query(
    `INSERT INTO users (name, email, password, level, xp, streak, energy, 
     sound_enabled, notifications_enabled, has_completed_onboarding) 
     VALUES (?, ?, ?, 1, 0, 0, 100, 0, 0, 0)`,
    [name, email, hashedPassword]
  );

  // 5) Get created user
  const [users] = await db.query(
    `SELECT id, name, email, level, xp, streak, goal, energy, 
     selected_mentor_id, active_mentor_id, sound_enabled, 
     notifications_enabled, has_completed_onboarding, created_at 
     FROM users WHERE id = ?`,
    [result.insertId]
  );

  // 6) Send token
  createSendToken(users[0], 201, res);
});

// Login user
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Validate input
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  // 2) Check if user exists
  const [users] = await db.query(
    'SELECT * FROM users WHERE email = ?',
    [email]
  );

  if (users.length === 0) {
    return next(new AppError('Invalid email or password', 401));
  }

  const user = users[0];

  // 3) Check password
  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    return next(new AppError('Invalid email or password', 401));
  }

  // 4) Remove password from output
  delete user.password;

  // 5) Send token
  createSendToken(user, 200, res);
});

// Get current user
exports.getMe = catchAsync(async (req, res, next) => {
  // userId is set by protect middleware
  const [users] = await db.query(
    `SELECT id, name, email, level, xp, streak, goal, energy, 
     selected_mentor_id, active_mentor_id, sound_enabled, 
     notifications_enabled, has_completed_onboarding, 
     created_at, updated_at 
     FROM users WHERE id = ?`,
    [req.userId]
  );

  if (users.length === 0) {
    return next(new AppError('User not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      user: users[0]
    }
  });
});

// Complete onboarding
exports.completeOnboarding = catchAsync(async (req, res, next) => {
  const { goal, soundEnabled, notificationsEnabled } = req.body;

  await db.query(
    `UPDATE users 
     SET goal = ?, 
         sound_enabled = ?, 
         notifications_enabled = ?, 
         has_completed_onboarding = 1 
     WHERE id = ?`,
    [goal || null, soundEnabled || false, notificationsEnabled || false, req.userId]
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