// src/middleware/auth.js
const jwt = require('jsonwebtoken');
const { AppError } = require('./errorHandler');
const config = require('../config/config');

// Verify JWT token
const protect = async (req, res, next) => {
  try {
    // 1) Get token from header
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('You are not logged in. Please log in to access.', 401));
    }

    // 2) Verify token
    const decoded = jwt.verify(token, config.jwt.secret);

    // 3) Attach user to request
    req.userId = decoded.id;
    next();
  } catch (error) {
    return next(new AppError('Invalid token. Please log in again.', 401));
  }
};

module.exports = { protect };