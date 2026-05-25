const mongoose = require('mongoose');

const resumeReportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  filePath: {
    type: String,
    required: true
  },
  atsScore: {
    type: Number,
    required: true
  },
  analysis: {
    skillsFound: [String],
    missingKeywords: [String],
    strengths: [String],
    improvements: [String],
    sections: {
      contact: Boolean,
      summary: Boolean,
      experience: Boolean,
      education: Boolean,
      skills: Boolean,
      projects: Boolean
    }
  }
}, {
  timestamps: true
});

resumeReportSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('ResumeReport', resumeReportSchema);
