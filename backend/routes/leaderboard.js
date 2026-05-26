const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');
const Test = require('../models/Test');

const router = express.Router();

// Get leaderboard — supports ?period=week|month|all
router.get('/', auth, async (req, res) => {
  try {
    const { period = 'all' } = req.query;

    // For period-based filtering we sort by XP earned in that window.
    // Since we don't store per-period XP on the user, we fall back to
    // total XP for 'all' and use test scores for week/month approximations.
    let users;

    if (period === 'week' || period === 'month') {
      const since = new Date();
      if (period === 'week') since.setDate(since.getDate() - 7);
      else since.setMonth(since.getMonth() - 1);

      // Aggregate XP earned from tests in the period
      const testAgg = await Test.aggregate([
        { $match: { createdAt: { $gte: since } } },
        { $group: { _id: '$userId', periodXP: { $sum: '$score' } } }
      ]).catch(() => []);

      const xpMap = {};
      testAgg.forEach(r => { xpMap[String(r._id)] = r.periodXP; });

      users = await User.find()
        .select('name email profilePhoto xp streak testsCompleted codingProblemsSolved')
        .lean();

      // Sort by period XP (fallback to 0 if no activity)
      users.sort((a, b) => (xpMap[String(b._id)] || 0) - (xpMap[String(a._id)] || 0));
      users = users.slice(0, 50);
    } else {
      users = await User.find()
        .select('name email profilePhoto xp streak testsCompleted codingProblemsSolved')
        .sort({ xp: -1 })
        .limit(50)
        .lean();
    }

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
