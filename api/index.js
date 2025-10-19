const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is working!' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is working!' });
});

// Authentication endpoints
app.post('/api/auth/login', (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({
      success: false,
      error: 'Email is required'
    });
  }
  
  res.json({
    success: true,
    message: 'Magic link sent to your email',
    data: { email }
  });
});

app.post('/api/auth/verify', (req, res) => {
  const { token_hash, type, email } = req.body;
  
  res.json({
    success: true,
    data: {
      user: {
        id: 'user123',
        email: email,
        name: 'User'
      },
      session: {
        id: 'session123',
        token: 'mock_token'
      }
    }
  });
});

app.listen(port, () => {
  console.log(`API running on port ${port}`);
});

module.exports = app;