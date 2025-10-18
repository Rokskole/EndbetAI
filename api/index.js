// Simple API handler for Vercel
const express = require('express');
const app = express();

app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API routes placeholder
app.all('/api/*', (req, res) => {
  res.json({
    success: false,
    error: 'API routes not implemented in simple handler',
    message: 'This is a placeholder API handler'
  });
});

// Catch all
app.all('*', (req, res) => {
  res.json({
    success: false,
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

module.exports = app;
