const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const auth = require('../middleware/auth');
const fetch = require('node-fetch');

const router = express.Router();

// Read JWT_SECRET lazily so it always picks up the value loaded from .env
const getSecret = () => process.env.JWT_SECRET;

// ─── Register ────────────────────────────────────────────────────────────────
router.post('/register', async (req, res) => {
  const JWT_SECRET = getSecret();
  if (!JWT_SECRET) {
    return res.status(500).json({ error: 'JWT secret not configured' });
  }

  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email and password are required' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  // Check if DB is reachable
  const dbAvailable = mongoose.connection.readyState === 1;

  if (!dbAvailable) {
    // Demo mode: simulate registration without DB
    try {
      const mockId = Date.now().toString();
      const token = jwt.sign({ userId: mockId }, JWT_SECRET, { expiresIn: '7d' });
      return res.status(201).json({
        message: 'Account created (Demo Mode — data not persisted)',
        token,
        user: { id: mockId, name: name.trim(), email: email.toLowerCase().trim() }
      });
    } catch (e) {
      return res.status(500).json({ error: 'Registration failed' });
    }
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() }).maxTimeMS(10000);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Create and save user
    const user = new User({ name: name.trim(), email: email.toLowerCase().trim(), password });
    await user.save();

    const token = jwt.sign({ userId: user._id.toString() }, JWT_SECRET, { expiresIn: '7d' });
    return res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Register error:', error.message);
    return res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
});

// ─── Login ───────────────────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  const JWT_SECRET = getSecret();
  if (!JWT_SECRET) {
    return res.status(500).json({ error: 'JWT secret not configured' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  // Check if DB is reachable
  const dbAvailable = mongoose.connection.readyState === 1;

  if (!dbAvailable) {
    // Demo mode: simulate login without DB
    try {
      const mockId = Date.now().toString();
      const token = jwt.sign({ userId: mockId }, JWT_SECRET, { expiresIn: '7d' });
      return res.json({
        message: 'Login successful (Demo Mode)',
        token,
        user: {
          id: mockId,
          name: email.split('@')[0],
          email,
          profilePhoto: 'default-avatar.png',
          xp: 0,
          streak: 0
        }
      });
    } catch (e) {
      return res.status(500).json({ error: 'Login failed' });
    }
  }

  try {
    // Find user in DB
    const user = await User.findOne({ email: email.toLowerCase().trim() }).maxTimeMS(10000);

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    user.lastActive = Date.now();
    await user.save().catch(() => {});

    const token = jwt.sign({ userId: user._id.toString() }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        profilePhoto: user.profilePhoto,
        xp: user.xp,
        streak: user.streak
      }
    });
  } catch (error) {
    console.error('Login error:', error.message);
    return res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});

// ─── Get current user ────────────────────────────────────────────────────────
router.get('/me', auth, async (req, res) => {
  try {
    res.json({ user: req.user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ─── Forgot password ─────────────────────────────────────────────────────────
router.post('/forgot-password', async (req, res) => {
  const JWT_SECRET = getSecret();
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const user = await User.findOne({ email: email.toLowerCase().trim() }).catch(() => null);

    // Always return 200 to avoid email enumeration
    if (!user || !JWT_SECRET) {
      return res.json({ message: 'If that email is registered, a reset link has been sent.' });
    }

    const resetToken = jwt.sign({ userId: user._id.toString(), purpose: 'reset' }, JWT_SECRET, { expiresIn: '1h' });
    const resetUrl = `${process.env.BASE_URL || 'http://localhost:5000'}/reset-password.html?token=${resetToken}`;

    // In production integrate nodemailer / SendGrid here.
    // For now log the link so it can be tested locally.
    console.log(`[Password Reset] Link for ${email}: ${resetUrl}`);

    res.json({ message: 'If that email is registered, a reset link has been sent.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ─── Google OAuth ─────────────────────────────────────────────────────────────
router.get('/google', (req, res) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    return res.status(501).json({ error: 'Google OAuth not configured. Add GOOGLE_CLIENT_ID to .env' });
  }

  const redirectUri = process.env.GOOGLE_CALLBACK_URL ||
    `${process.env.BASE_URL || 'http://localhost:5000'}/api/auth/google/callback`;

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid profile email',
    access_type: 'offline',
    prompt: 'consent'
  });

  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
});

router.get('/google/callback', async (req, res) => {
  const JWT_SECRET = getSecret();
  const code = req.query.code;
  if (!code) return res.redirect('/login.html');

  try {
    const redirectUri = process.env.GOOGLE_CALLBACK_URL ||
      `${process.env.BASE_URL || 'http://localhost:5000'}/api/auth/google/callback`;

    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code'
      })
    });

    const tokenJson = await tokenRes.json();
    if (!tokenJson.access_token) return res.redirect('/login.html');

    const profileRes = await fetch(
      'https://www.googleapis.com/oauth2/v2/userinfo?access_token=' + tokenJson.access_token
    );
    const profile = await profileRes.json();

    let user = await User.findOne({ email: profile.email }).catch(() => null);
    if (!user) {
      user = new User({
        name: profile.name || profile.email.split('@')[0],
        email: profile.email,
        password: Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2),
        profilePhoto: profile.picture || 'default-avatar.png'
      });
      await user.save().catch(() => { user._id = Date.now().toString(); });
    }

    if (!JWT_SECRET) return res.redirect('/login.html');

    const token = jwt.sign({ userId: user._id.toString() }, JWT_SECRET, { expiresIn: '7d' });
    res.redirect(`/dashboard.html?token=${token}`);
  } catch (err) {
    console.error('Google OAuth error:', err);
    res.redirect('/login.html');
  }
});

module.exports = router;
