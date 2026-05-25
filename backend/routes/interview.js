const express = require('express');
const InterviewFeedback = require('../models/InterviewFeedback');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get interview questions
router.get('/questions', auth, async (req, res) => {
  try {
    const { type = 'technical' } = req.query;
    
    const questionSets = {
      technical: [
        'Explain the difference between var, let, and const in JavaScript.',
        'What is the virtual DOM in React?',
        'Explain the concept of closures in JavaScript.',
        'What are promises and how do they work?',
        'Describe the SOLID principles in software engineering.'
      ],
      hr: [
        'Tell me about yourself.',
        'Why do you want to work for our company?',
        'What are your strengths and weaknesses?',
        'Where do you see yourself in 5 years?',
        'Describe a challenging situation and how you handled it.'
      ],
      behavioral: [
        'Describe a time when you worked in a team.',
        'How do you handle conflicts with team members?',
        'Tell me about a project you are most proud of.',
        'How do you prioritize tasks when working on multiple projects?',
        'Describe a time when you failed and what you learned.'
      ]
    };

    res.json({ questions: questionSets[type] || questionSets.technical });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Submit interview
router.post('/submit', auth, async (req, res) => {
  try {
    const { interviewType, questions, duration } = req.body;
    
    // Simulate AI scoring
    const feedback = {
      confidence: Math.floor(Math.random() * 30) + 70,
      communication: Math.floor(Math.random() * 30) + 70,
      technicalAccuracy: Math.floor(Math.random() * 30) + 70,
      clarity: Math.floor(Math.random() * 30) + 70
    };

    const overallScore = Math.round(
      (feedback.confidence + feedback.communication + 
       feedback.technicalAccuracy + feedback.clarity) / 4
    );

    const interviewFeedback = new InterviewFeedback({
      userId: req.userId,
      interviewType,
      questions,
      overallScore,
      feedback,
      strengths: [
        'Good technical knowledge',
        'Clear communication',
        'Confident delivery'
      ],
      improvements: [
        'Provide more specific examples',
        'Work on body language',
        'Practice common questions'
      ],
      duration
    });

    await interviewFeedback.save();

    // Update user stats
    const user = await User.findById(req.userId);
    user.interviewsTaken += 1;
    user.xp += overallScore;
    await user.save();

    res.json({
      message: 'Interview submitted successfully',
      feedback: {
        overallScore,
        ...feedback,
        strengths: interviewFeedback.strengths,
        improvements: interviewFeedback.improvements
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get interview history
router.get('/history', auth, async (req, res) => {
  try {
    const interviews = await InterviewFeedback.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();
    
    res.json({ interviews });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
