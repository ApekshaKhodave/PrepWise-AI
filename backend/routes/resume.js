const express = require('express');
const multer  = require('multer');
const path    = require('path');
const fs      = require('fs');
const pdfParse = require('pdf-parse');
const Groq    = require('groq-sdk');
const ResumeReport = require('../models/ResumeReport');
const User    = require('../models/User');
const auth    = require('../middleware/auth');

const router = express.Router();

// ─── Groq client (lazy) ───────────────────────────────────────
let groq = null;
function getGroq() {
  if (!groq && process.env.GROQ_API_KEY) {
    groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return groq;
}

// ─── Upload config ────────────────────────────────────────────
const uploadDir = path.join(__dirname, '../../uploads/resumes');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename:    (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['.pdf', '.doc', '.docx'];
    if (allowed.includes(path.extname(file.originalname).toLowerCase())) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and Word documents are allowed.'));
    }
  }
});

// ─── Offline fallback ─────────────────────────────────────────
function analyzeTextOffline(text) {
  const lower = text.toLowerCase();

  const sections = {
    contact:    /contact|email|phone|address|linkedin|github/i.test(lower),
    summary:    /summary|objective|about me|profile/i.test(lower),
    experience: /experience|work history|employment|internship/i.test(lower),
    education:  /education|academic|university|college|school/i.test(lower),
    skills:     /skills|technical skills|expertise|proficiencies/i.test(lower),
    projects:   /projects|personal project|academic project/i.test(lower)
  };

  // Safe skill detection — escape special regex chars
  const skillsList = [
    'javascript', 'typescript', 'python', 'java', 'c\\+\\+', 'c#', 'go',
    'html', 'css', 'react', 'angular', 'vue', 'node', 'express',
    'django', 'flask', 'spring', 'mongodb', 'sql', 'postgresql', 'mysql',
    'git', 'docker', 'kubernetes', 'aws', 'azure', 'gcp',
    'machine learning', 'data science', 'tensorflow', 'pytorch'
  ];

  const skillsFound = [];
  skillsList.forEach(skill => {
    try {
      if (new RegExp(`\\b${skill}\\b`, 'i').test(lower)) {
        skillsFound.push(skill.replace('\\+\\+', '++').replace('\\#', '#').toUpperCase());
      }
    } catch (_) {}
  });

  if (skillsFound.length === 0) skillsFound.push('JAVASCRIPT', 'HTML', 'CSS', 'GIT');

  const allKeywords = ['REST API', 'Docker', 'System Design', 'CI/CD', 'Unit Testing', 'Data Structures', 'Algorithms', 'Cloud Computing'];
  const missingKeywords = allKeywords.filter(kw => !lower.includes(kw.toLowerCase()));

  const sCount = Object.values(sections).filter(Boolean).length;
  let atsScore = Math.min(95, 40 + sCount * 7 + skillsFound.length * 2.5);
  atsScore = Math.round(atsScore);

  const strengths = [];
  if (sections.experience) strengths.push('Strong professional experience section.');
  if (sections.education)  strengths.push('Clear educational history presented.');
  if (skillsFound.length > 5) strengths.push('Excellent range of technical skills highlighted.');
  if (strengths.length === 0) strengths.push('Basic resume structure is in place.');

  const improvements = [];
  if (!sections.summary)  improvements.push('Add a concise professional summary at the top.');
  if (!sections.projects) improvements.push('Include detailed project descriptions with technologies used.');
  if (missingKeywords.length > 0) improvements.push(`Add key terms: ${missingKeywords.slice(0, 3).join(', ')}.`);
  if (improvements.length === 0)  improvements.push('Strengthen action verbs for greater impact.');

  return { atsScore, analysis: { skillsFound, missingKeywords: missingKeywords.slice(0, 4), strengths, improvements, sections } };
}

// ─── Groq-powered analysis ────────────────────────────────────
async function analyzeWithGroq(resumeText) {
  const client = getGroq();

  const prompt = `You are an expert ATS resume reviewer for tech placements (India focus: TCS, Infosys, Google, Microsoft, Amazon etc.).

Analyze the following resume text and return ONLY a valid JSON object (no markdown, no explanation) that matches this exact schema:
{
  "atsScore": <integer 0-100>,
  "analysis": {
    "skillsFound": ["Skill1", "Skill2"],
    "missingKeywords": ["Keyword1", "Keyword2"],
    "strengths": ["Strength 1", "Strength 2"],
    "improvements": ["Improvement 1", "Improvement 2"],
    "sections": {
      "contact": <boolean>,
      "summary": <boolean>,
      "experience": <boolean>,
      "education": <boolean>,
      "skills": <boolean>,
      "projects": <boolean>
    }
  }
}

Rules:
- atsScore reflects how well this resume would pass automated ATS filters (0–100)
- skillsFound: list actual technical/soft skills found in the text
- missingKeywords: important industry terms NOT found but relevant to a tech candidate
- strengths: 2–4 specific positive observations about this resume
- improvements: 2–4 specific, actionable suggestions to improve the resume
- sections: true/false for whether each standard section exists

Resume Text:
${resumeText.slice(0, 6000)}`;

  const completion = await client.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.3,
    max_tokens: 1024
  });

  const raw = completion.choices[0]?.message?.content || '';
  // Extract JSON from response
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('No JSON found in Groq response');
  return JSON.parse(match[0]);
}

// ─── POST /api/resume/analyze ─────────────────────────────────
router.post('/analyze', auth, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Please upload a resume file' });

    const filePath = req.file.path;
    const fileName = req.file.originalname;
    let resumeText = '';

    // Extract text from PDF
    if (path.extname(fileName).toLowerCase() === '.pdf') {
      try {
        const buf = fs.readFileSync(filePath);
        const parsed = await pdfParse(buf);
        resumeText = parsed.text;
      } catch (err) {
        console.warn('PDF parse failed:', err.message);
      }
    }

    let reportData;
    const client = getGroq();

    if (client && resumeText) {
      try {
        console.log('🤖 Analyzing resume with Groq (llama3-8b-8192)...');
        reportData = await analyzeWithGroq(resumeText);
        console.log(`✅ Groq analysis complete — ATS Score: ${reportData.atsScore}`);
      } catch (groqErr) {
        console.error('Groq analysis failed, using offline fallback:', groqErr.message);
        reportData = analyzeTextOffline(resumeText);
      }
    } else {
      // Offline fallback
      console.log(client ? '⚠️  No resume text extracted, using offline fallback' : '⚠️  GROQ_API_KEY not set, using offline fallback');
      reportData = analyzeTextOffline(resumeText || `Resume file: ${fileName}`);
    }

    // Save to DB
    const report = new ResumeReport({
      userId:   req.userId,
      fileName,
      filePath: `/uploads/resumes/${req.file.filename}`,
      atsScore: reportData.atsScore,
      analysis: reportData.analysis
    });
    await report.save();

    // Update user XP + resume score
    const user = await User.findById(req.userId);
    if (user) {
      user.resumeScore = reportData.atsScore;
      user.xp += Math.round(reportData.atsScore / 2);
      await user.save();
    }

    res.json({ message: 'Resume analyzed successfully', report });

  } catch (error) {
    console.error('Resume Analysis Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ─── GET /api/resume/reports ──────────────────────────────────
router.get('/reports', auth, async (req, res) => {
  try {
    const reports = await ResumeReport.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .lean();
    res.json({ reports });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
