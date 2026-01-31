// src/utils/jwt.js
const jwt = require('jsonwebtoken');
const config = require('../config/config');

// Generate JWT token
const signToken = (userId) => {
  return jwt.sign({ id: userId }, config.jwt.secret, {
    expiresIn: config.jwt.expire
  });
};

// Create and send token response
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user.id);

  // Remove password from output
  delete user.password;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

module.exports = { signToken, createSendToken };