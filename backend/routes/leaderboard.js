const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get leaderboard
router.get('/', auth, async (req, res) => {
  try {
    const users = await User.find()
      .select('name email profilePhoto xp streak testsCompleted codingProblemsSolved')
      .sort({ xp: -1 })
      .limit(50)
      .lean();

    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      name: user.name,
      email: user.email,
      profilePhoto: user.profilePhoto,
      xp: user.xp,
      streak: user.streak,
      testsCompleted: user.testsCompleted,
      codingProblemsSolved: user.codingProblemsSolved
    }));

    res.json({ leaderboard });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
