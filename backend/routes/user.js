const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');
const multer = require('multer');
const { put } = require('@vercel/blob');

const router = express.Router();



const avatarUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    if (allowed.includes(path.extname(file.originalname).toLowerCase())) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Get user dashboard data
router.get('/dashboard', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      // Demo mode — req.user is the mock object from middleware
      return res.json({ user: req.user });
    }

    res.json({
      user: {
        name: user.name,
        email: user.email,
        profilePhoto: user.profilePhoto,
        xp: user.xp,
        streak: user.streak,
        testsCompleted: user.testsCompleted,
        codingProblemsSolved: user.codingProblemsSolved,
        resumeScore: user.resumeScore,
        interviewsTaken: user.interviewsTaken,
        skills: user.skills,
        achievements: user.achievements,
        college: user.college,
        branch: user.branch
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, college, branch, skills } = req.body;

    // Basic validation
    if (name !== undefined && (typeof name !== 'string' || name.trim().length === 0 || name.length > 100)) {
      return res.status(400).json({ error: 'Invalid name' });
    }

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (name) user.name = name.trim();
    if (college !== undefined) user.college = college.trim().substring(0, 200);
    if (branch !== undefined) user.branch = branch.trim().substring(0, 100);
    if (skills && Array.isArray(skills)) {
      user.skills = skills.slice(0, 20).map(s => ({
        name: String(s.name || '').substring(0, 50),
        level: Math.min(100, Math.max(0, parseInt(s.level) || 0))
      }));
    }
    
    await user.save();
    
    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upload avatar
router.post('/avatar', auth, avatarUpload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const blob = await put(
      `avatar-${req.userId}-${Date.now()}-${req.file.originalname}`,
      req.file.buffer,
      {
        access: 'public'
      }
    );

    const profilePhoto = blob.url;

    const user = await User.findById(req.userId);
    if (user) {
      user.profilePhoto = profilePhoto;
      await user.save();
    }

    res.json({ message: 'Avatar updated', profilePhoto });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update preferences
router.put('/preferences', auth, async (req, res) => {
  try {
    const { theme, notifications } = req.body;
    
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (theme && ['light', 'dark'].includes(theme)) user.preferences.theme = theme;
    if (notifications !== undefined) user.preferences.notifications = Boolean(notifications);
    
    await user.save();
    
    res.json({ message: 'Preferences updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete account
router.delete('/account', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    await User.findByIdAndDelete(req.userId);
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
