const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    enum: ['quantitative', 'logical', 'verbal'],
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  correctAnswers: {
    type: Number,
    required: true
  },
  timeTaken: {
    type: Number,
    required: true
  },
  accuracy: {
    type: Number,
    required: true
  },
  weakTopics: [String],
  answers: [{
    questionId: String,
    selectedAnswer: String,
    correctAnswer: String,
    isCorrect: Boolean
  }]
}, {
  timestamps: true
});

testSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Test', testSchema);
