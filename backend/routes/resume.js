const express = require('express');
const multer = require('multer');
const path = require('path');
const ResumeReport = require('../models/ResumeReport');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/resumes/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    if (extname) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and DOC files are allowed'));
    }
  }
});

// Upload and analyze resume
router.post('/analyze', auth, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Simulate AI analysis (in production, use actual AI/ML service)
    const atsScore = Math.floor(Math.random() * 30) + 70; // 70-100
    
    const analysis = {
      skillsFound: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Python', 'Git'],
      missingKeywords: ['Docker', 'Kubernetes', 'AWS', 'CI/CD'],
      strengths: [
        'Clear project descriptions',
        'Quantified achievements',
        'Relevant technical skills',
        'Good formatting'
      ],
      improvements: [
        'Add more action verbs',
        'Include certifications',
        'Add LinkedIn profile',
        'Optimize for ATS keywords'
      ],
      sections: {
        contact: true,
        summary: true,
        experience: true,
        education: true,
        skills: true,
        projects: true
      }
    };

    const report = new ResumeReport({
      userId: req.userId,
      fileName: req.file.originalname,
      filePath: req.file.path,
      atsScore,
      analysis
    });

    await report.save();

    // Update user resume score
    const user = await User.findById(req.userId);
    user.resumeScore = atsScore;
    await user.save();

    res.json({
      message: 'Resume analyzed successfully',
      report: {
        atsScore,
        analysis
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get resume reports
router.get('/reports', auth, async (req, res) => {
  try {
    const reports = await ResumeReport.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();
    
    res.json({ reports });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
