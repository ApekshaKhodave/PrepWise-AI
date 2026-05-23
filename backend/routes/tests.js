const express = require('express');
const Test = require('../models/Test');
const Question = require('../models/Question');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get questions for test
router.get('/questions', auth, async (req, res) => {
  try {
    const { category, difficulty, limit = 10 } = req.query;
    
    const questions = await Question.aggregate([
      { $match: { category, difficulty } },
      { $sample: { size: parseInt(limit) } }
    ]);

    // Remove correct answers from response
    const questionsWithoutAnswers = questions.map(q => ({
      _id: q._id,
      question: q.question,
      options: q.options,
      topic: q.topic
    }));

    res.json({ questions: questionsWithoutAnswers });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Submit test
router.post('/submit', auth, async (req, res) => {
  try {
    const { category, difficulty, answers, timeTaken } = req.body;
    
    // Calculate score
    let correctAnswers = 0;
    const detailedAnswers = [];
    const weakTopics = new Set();

    for (const answer of answers) {
      const question = await Question.findById(answer.questionId);
      const isCorrect = question.correctAnswer === answer.selectedAnswer;
      
      if (isCorrect) {
        correctAnswers++;
      } else {
        weakTopics.add(question.topic);
      }

      detailedAnswers.push({
        questionId: answer.questionId,
        selectedAnswer: answer.selectedAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect
      });
    }

    const totalQuestions = answers.length;
    const score = Math.round((correctAnswers / totalQuestions) * 100);
    const accuracy = score;

    // Save test result
    const test = new Test({
      userId: req.userId,
      category,
      difficulty,
      score,
      totalQuestions,
      correctAnswers,
      timeTaken,
      accuracy,
      weakTopics: Array.from(weakTopics),
      answers: detailedAnswers
    });

    await test.save();

    // Update user stats
    const user = await User.findById(req.userId);
    user.testsCompleted += 1;
    user.xp += score;
    await user.save();

    res.json({
      message: 'Test submitted successfully',
      result: {
        score,
        correctAnswers,
        totalQuestions,
        accuracy,
        weakTopics: Array.from(weakTopics),
        xpEarned: score
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get test history
router.get('/history', auth, async (req, res) => {
  try {
    const tests = await Test.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .limit(10);
    
    res.json({ tests });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
