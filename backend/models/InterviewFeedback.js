const mongoose = require('mongoose');

const interviewFeedbackSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  interviewType: {
    type: String,
    enum: ['technical', 'hr', 'behavioral'],
    required: true
  },
  questions: [{
    question: String,
    answer: String,
    aiScore: Number
  }],
  overallScore: {
    type: Number,
    required: true
  },
  feedback: {
    confidence: Number,
    communication: Number,
    technicalAccuracy: Number,
    clarity: Number
  },
  strengths: [String],
  improvements: [String],
  duration: Number
}, {
  timestamps: true
});

module.exports = mongoose.model('InterviewFeedback', interviewFeedbackSchema);
