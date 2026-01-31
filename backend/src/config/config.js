// src/config/config.js
require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  database: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME || 'imperium-ai'
  },
  
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    expire: process.env.JWT_EXPIRE || '7d'
  },
  
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000'
};