
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// For now, we'll create a simple login endpoint
// In a real application, you would have a user model and database table
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // For demo purposes, we'll use a hardcoded admin user
    // In production, you would check the database
    if (username === 'admin' && password === 'admin123') {
      // Generate JWT token
      const token = jwt.sign(
        { id: 1, username, role: 'admin' },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      return res.json({
        user: { id: 1, username, role: 'admin' },
        token
      });
    }
    
    res.status(401).json({ message: 'Invalid credentials' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Check token validity
router.get('/verify', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ valid: false });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ valid: true, user: decoded });
  } catch (error) {
    res.status(401).json({ valid: false });
  }
});

module.exports = router;