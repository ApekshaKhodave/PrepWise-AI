const express = require('express');
const CodingProblem = require('../models/CodingProblem');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all coding problems
router.get('/problems', auth, async (req, res) => {
  try {
    const { difficulty, search } = req.query;
    
    let query = {};
    if (difficulty) query.difficulty = difficulty;
    if (search) query.title = { $regex: search, $options: 'i' };

    const problems = await CodingProblem.find(query).sort({ createdAt: -1 });
    res.json({ problems });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single problem
router.get('/problems/:id', auth, async (req, res) => {
  try {
    const problem = await CodingProblem.findById(req.params.id);
    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }
    res.json({ problem });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Submit solution
router.post('/submit', auth, async (req, res) => {
  try {
    const { problemId, code, language } = req.body;
    
    // Simulate code execution (in production, use a code execution service)
    const passed = Math.random() > 0.3; // 70% pass rate for demo
    
    if (passed) {
      const user = await User.findById(req.userId);
      user.codingProblemsSolved += 1;
      user.xp += 50;
      await user.save();

      const problem = await CodingProblem.findById(problemId);
      problem.solvedBy += 1;
      await problem.save();
    }

    res.json({
      success: passed,
      message: passed ? 'All test cases passed!' : 'Some test cases failed',
      testsPassed: passed ? 10 : Math.floor(Math.random() * 8),
      totalTests: 10,
      xpEarned: passed ? 50 : 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
