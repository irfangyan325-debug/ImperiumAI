// src/server.js
const express = require('express');
const cors = require('cors');
const config = require('./config/config');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(cors({
  origin: config.frontendUrl,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'success',
    message: 'Imperium AI Backend is running',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/mentors', require('./routes/mentors'));
app.use('/api/decrees', require('./routes/decrees'));
app.use('/api/journal', require('./routes/journal'));
app.use('/api/path', require('./routes/path'));
app.use('/api/council', require('./routes/council')); 

// 404 handler
app.all('*', (req, res) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server`
  });
});

// Global error handler
app.use(errorHandler);

// Start server
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${config.nodeEnv}`);
  console.log(`🔗 Frontend URL: ${config.frontendUrl}`);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥');
  console.log(err.name, err.message);
  process.exit(1);
});
