const mongoose = require('mongoose');

const codingProblemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  tags: [String],
  companies: [String],
  inputFormat: String,
  outputFormat: String,
  constraints: String,
  examples: [{
    input: String,
    output: String,
    explanation: String
  }],
  testCases: [{
    input: String,
    output: String
  }],
  solvedBy: {
    type: Number,
    default: 0
  },
  acceptanceRate: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

codingProblemSchema.index({ title: 'text', difficulty: 1, createdAt: -1 });

module.exports = mongoose.model('CodingProblem', codingProblemSchema);
