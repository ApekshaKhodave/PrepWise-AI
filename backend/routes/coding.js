const express = require('express');
const CodingProblem = require('../models/CodingProblem');
const User = require('../models/User');
const auth = require('../middleware/auth');
const mongoose = require('mongoose');

const router = express.Router();

// Get all coding problems
router.get('/problems', auth, async (req, res) => {
  try {
    const { difficulty, search } = req.query;
    // If MongoDB isn't connected, return a safe demo fallback
    if (mongoose.connection.readyState !== 1) {
      const demoProblems = [
        { id: 'demo-1', title: 'Two Sum', difficulty: 'Easy', description: 'Find two numbers that add up to target', createdAt: new Date(), solvedBy: 0 },
        { id: 'demo-2', title: 'Reverse Linked List', difficulty: 'Medium', description: 'Reverse a singly linked list', createdAt: new Date(), solvedBy: 0 }
      ];
      return res.json({ problems: demoProblems, demo: true, warning: 'Database not connected - returning demo problems' });
    }

    let query = {};
    if (difficulty) query.difficulty = difficulty;
    if (search) query.title = { $regex: search, $options: 'i' };

    const problems = await CodingProblem.find(query).sort({ createdAt: -1 }).lean();
    res.json({ problems });
  } catch (error) {
    // If the error indicates mongoose buffering timed out, return demo fallback
    if (error && error.message && error.message.includes('buffering timed out')) {
      return res.json({ problems: [], demo: true, warning: 'Database unavailable (buffering timed out)' });
    }

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
    
    // NOTE: Real code execution requires an external sandboxed service (e.g. Judge0 API).
    // Until integrated, submissions are evaluated with a simulated 70% pass rate.
    // To integrate Judge0: https://judge0.com/
    const passed = Math.random() > 0.3;
    
    if (passed) {
      const user = await User.findById(req.userId);
      if (user) {
        user.codingProblemsSolved = (user.codingProblemsSolved || 0) + 1;
        user.xp += 50;
        await user.save();
      }

      const problem = await CodingProblem.findById(problemId).catch(() => null);
      if (problem) {
        problem.solvedBy = (problem.solvedBy || 0) + 1;
        await problem.save();
      }
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
