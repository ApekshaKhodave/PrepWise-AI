const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const mongoose = require('mongoose');

const ResumeReport = require('../models/ResumeReport');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Helper to initialize and retrieve Gemini model
const getGeminiModel = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not defined in the environment variables. Please add it to your .env file.');
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: {
      responseMimeType: 'application/json'
    }
  });
};

/* =========================
   MULTER CONFIGURATION
========================= */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/resumes/';

    // Create folder if not exists
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },

  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf/;

    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (extname) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF resumes are allowed'));
    }
  }
});

/* =========================
   ANALYSIS FUNCTION WITH GEMINI API
========================= */

const analyzeResumeWithGemini = async (resumeText) => {
  try {
    const model = getGeminiModel();
    const prompt = `You are an expert ATS (Applicant Tracking System) optimizer and resume reviewer.
Analyze the following extracted resume text. Perform text mining and detailed resume analysis, then return a JSON object with this exact structure:
{
  "atsScore": 75,
  "skillsFound": ["JavaScript", "React", "Node.js", "Express", "MongoDB", "Git"],
  "missingKeywords": ["Docker", "AWS", "CI/CD", "TypeScript", "Unit Testing"],
  "strengths": [
    "Strong project descriptions showing clear technologies used",
    "Education details are well structured with GPA mentioned",
    "Good inclusion of foundational web development technologies",
    "Professional contact links are included"
  ],
  "improvements": [
    "Add more action-oriented verbs to describe achievements",
    "Quantify your accomplishments (e.g., improved load time by 20%)",
    "Include a professional summary at the beginning of the resume",
    "Incorporate key DevOps skills like Docker or cloud platforms (AWS) to expand job compatibility"
  ],
  "sections": {
    "contact": true,
    "summary": false,
    "experience": true,
    "education": true,
    "skills": true,
    "projects": true
  }
}

Guidelines:
1. Mined Skills (skillsFound): Extract actual technologies, frameworks, and programming languages present in the resume.
2. Missing Keywords: Based on the skills and projects present, identify the candidate's career domain (e.g., frontend developer, full-stack developer, data analyst). Determine 4-6 essential high-demand skills or tools for that domain that are NOT present in their resume text.
3. Strengths: Provide 4-5 genuine, personalized strengths of this resume.
4. Improvements: Provide 4-5 specific, actionable feedback items for improvement.
5. Sections: Detect if the following sections are present in the text (case-insensitive): contact info (email/phone), professional summary/objective, work experience/internships, education, skills, projects.
6. ATS Score: Calculate a realistic ATS score (0-100) based on content, sections present, and industry relevance.

Resume Text:
${resumeText}

Return only the valid JSON object conforming to the structure above.`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Clean Gemini response
let cleanedResponse = responseText
  .replace(/```json/g, '')
  .replace(/```/g, '')
  .trim();

let analysis;

try {
  analysis = JSON.parse(cleanedResponse);
} catch (parseError) {

  console.error('Gemini JSON Parse Error:', cleanedResponse);

  const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);

  if (!jsonMatch) {
    throw new Error('Invalid JSON response from Gemini');
  }

  analysis = JSON.parse(jsonMatch[0]);
}
    
    return {
      atsScore: Math.min(100, Math.max(0, typeof analysis.atsScore === 'number' ? analysis.atsScore : 65)),
      analysis: {
        skillsFound: Array.isArray(analysis.skillsFound) ? analysis.skillsFound : [],
        missingKeywords: Array.isArray(analysis.missingKeywords) ? analysis.missingKeywords : [],
        strengths: Array.isArray(analysis.strengths) ? analysis.strengths : [],
        improvements: Array.isArray(analysis.improvements) ? analysis.improvements : [],
        sections: analysis.sections || {
          contact: false,
          summary: false,
          experience: false,
          education: false,
          skills: false,
          projects: false
        }
      }
    };
  } catch (error) {
    console.error('Error analyzing resume with Gemini:', error);
    if (error.message && error.message.includes('GEMINI_API_KEY is not defined')) {
      throw error;
    }
    throw new Error('Resume analysis failed: ' + error.message);
  }
};

/* =========================
   UPLOAD & ANALYZE RESUME
========================= */

router.post(
  '/analyze',
  auth,
  upload.single('resume'),
  async (req, res) => {

    try {

      if (!req.file) {
        return res.status(400).json({
          error: 'No resume uploaded'
        });
      }

      /* =========================
         READ PDF
      ========================= */

      const pdfBuffer = fs.readFileSync(req.file.path);

      const pdfData = await pdfParse(pdfBuffer);

      const extractedText = pdfData.text?.trim();


      if (!extractedText || extractedText.length < 20) {
  
        return res.status(400).json({
    
          success: false,
    
          error: 'Could not extract text from PDF. Upload a text-based resume PDF.'
  
        });

      }

      /* =========================
         SAVE TXT FILE
      ========================= */

      const txtFolder = 'uploads/txt/';

      if (!fs.existsSync(txtFolder)) {
        fs.mkdirSync(txtFolder, { recursive: true });
      }

      const txtFileName =
        path.basename(req.file.filename, '.pdf') + '.txt';

      const txtFilePath = path.join(txtFolder, txtFileName);

      try {
  
        fs.writeFileSync(txtFilePath, extractedText, 'utf8');

      } catch (txtError) {
  
        console.error('TXT Save Error:', txtError);

      }

      /* =========================
         ANALYZE RESUME
      ========================= */

      const { atsScore, analysis } = await analyzeResumeWithGemini(extractedText);

      /* =========================
         SAVE REPORT / UPDATE USER SCORE (IF DATABASE CONNECTED)
      ========================= */

      const isDbConnected = mongoose.connection.readyState === 1;

      if (isDbConnected) {
        try {
          const report = new ResumeReport({
            userId: req.userId,
            fileName: req.file.originalname,
            filePath: req.file.path,
            txtFilePath,
            atsScore,
            analysis
          });
          await report.save();

          await User.findByIdAndUpdate(req.userId, {
            resumeScore: atsScore
          });
        } catch (dbError) {
          console.error('Database write error, bypassing:', dbError);
        }
      } else {
        console.log('⚠️ Running in database-free/demo mode. Bypassing report save.');
      }

      /* =========================
         RESPONSE
      ========================= */

      // Delete uploaded PDF after analysis
      try {
        fs.unlinkSync(req.file.path);
      } catch (deleteError) {
        console.error('File delete error:', deleteError);
      }
        success: true,

        message: 'Resume analyzed successfully',

        report: {
          atsScore,

          analysis,

          txtFilePath
        }
      });

    } catch (error) {

      console.error('Resume Analyze Error:', error);

      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
);

/* =========================
   GET REPORTS
========================= */

router.get('/reports', auth, async (req, res) => {

  try {

    const reports = await ResumeReport.find({
      userId: req.userId
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    res.json({
      success: true,
      reports
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;