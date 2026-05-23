const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get user dashboard data
router.get('/dashboard', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
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
        achievements: user.achievements
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
    
    const user = await User.findById(req.userId);
    if (name) user.name = name;
    if (college) user.college = college;
    if (branch) user.branch = branch;
    if (skills) user.skills = skills;
    
    await user.save();
    
    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update preferences
router.put('/preferences', auth, async (req, res) => {
  try {
    const { theme, notifications } = req.body;
    
    const user = await User.findById(req.userId);
    if (theme) user.preferences.theme = theme;
    if (notifications !== undefined) user.preferences.notifications = notifications;
    
    await user.save();
    
    res.json({ message: 'Preferences updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
