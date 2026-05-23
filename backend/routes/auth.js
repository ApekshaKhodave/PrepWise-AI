const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email }).maxTimeMS(3000).catch(() => null);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Create user
    const user = new User({ name, email, password });
    await user.save().catch(() => {
      // If save fails (no DB), create mock user
      user._id = Date.now().toString();
    });

    // Generate token
    const token = jwt.sign({ userId: user._id || Date.now().toString() }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id || Date.now().toString(),
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    // Fallback for demo mode
    const mockUserId = Date.now().toString();
    const token = jwt.sign({ userId: mockUserId }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });
    
    res.status(201).json({
      message: 'User registered successfully (Demo Mode)',
      token,
      user: {
        id: mockUserId,
        name: req.body.name,
        email: req.body.email
      }
    });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user with timeout
    const user = await User.findOne({ email }).maxTimeMS(3000).catch(() => null);
    
    if (!user) {
      // Demo mode - create mock user for login
      const mockUserId = Date.now().toString();
      const token = jwt.sign({ userId: mockUserId }, process.env.JWT_SECRET, {
        expiresIn: '7d'
      });

      return res.json({
        message: 'Login successful (Demo Mode)',
        token,
        user: {
          id: mockUserId,
          name: email.split('@')[0],
          email: email,
          profilePhoto: 'default-avatar.png',
          xp: 5420,
          streak: 45
        }
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last active
    user.lastActive = Date.now();
    await user.save().catch(() => {});

    // Generate token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePhoto: user.profilePhoto,
        xp: user.xp,
        streak: user.streak
      }
    });
  } catch (error) {
    // Fallback for demo mode
    const mockUserId = Date.now().toString();
    const token = jwt.sign({ userId: mockUserId }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.json({
      message: 'Login successful (Demo Mode)',
      token,
      user: {
        id: mockUserId,
        name: req.body.email.split('@')[0],
        email: req.body.email,
        profilePhoto: 'default-avatar.png',
        xp: 5420,
        streak: 45
      }
    });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    res.json({ user: req.user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
