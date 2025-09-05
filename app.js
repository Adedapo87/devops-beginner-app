const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Hello DevOps World!',
    timestamp: new Date().toISOString(),
    version: require('./package.json').version
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    memory: process.memoryUsage(),
    version: require('./package.json').version
  });
});

app.get('/ready', (req, res) => {
  res.status(200).json({
    status: 'ready',
    timestamp: new Date().toISOString()
  });
});

// 500 error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    timestamp: new Date().toISOString()
  });
});

// Start server
const server = app.listen(port, () => {
  console.log(`${new Date().toISOString()} - Server running on port ${port}`);
});

// Graceful shutdown
['SIGINT', 'SIGTERM'].forEach(signal => {
  process.on(signal, () => {
    console.log(`${signal} received. Shutting down...`);
    server.close(() => {
      console.log('Server closed.');
      process.exit(0);
    });
  });
});

module.exports = app;
