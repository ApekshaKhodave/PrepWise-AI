const express = require('express');
const Groq = require('groq-sdk');
const InterviewFeedback = require('../models/InterviewFeedback');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// ─── Groq client (lazy) ───────────────────────────────────────
let groq = null;
function getGroq() {
  if (!groq && process.env.GROQ_API_KEY) {
    groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return groq;
}

// ─── Question bank ────────────────────────────────────────────
const questionSets = {
  technical: [
    'Explain the difference between var, let, and const in JavaScript.',
    'What is the virtual DOM in React and why is it faster?',
    'Explain closures in JavaScript with an example.',
    'What are Promises and how do they differ from callbacks?',
    'Describe the SOLID principles in software engineering.',
    'What is the difference between REST and GraphQL?',
    'How does the event loop work in Node.js?',
    'Explain the concept of database indexing and when to use it.',
    'What is the difference between SQL and NoSQL databases?',
    'Describe the time complexity of common sorting algorithms.'
  ],
  hr: [
    'Tell me about yourself and your background.',
    'Why do you want to work for our company?',
    'What are your greatest strengths and weaknesses?',
    'Where do you see yourself in 5 years?',
    'Describe a challenging situation at work/college and how you handled it.',
    'Why are you leaving your current role or looking for a job?',
    'How do you handle pressure and tight deadlines?',
    'What motivates you in your professional life?'
  ],
  behavioral: [
    'Describe a time when you worked effectively in a team.',
    'Tell me about a time you showed leadership.',
    'How do you handle conflicts with team members?',
    'Tell me about a project you are most proud of.',
    'How do you prioritize tasks when working on multiple projects?',
    'Describe a time when you failed and what you learned from it.',
    'Give an example of when you had to quickly learn a new skill.',
    'How do you handle receiving critical feedback?'
  ],
  system_design: [
    'Design a URL shortener like bit.ly.',
    'How would you design Twitter\'s timeline feature?',
    'Design a ride-sharing system like Uber.',
    'Explain how you would design a distributed cache.',
    'How would you design a notification system?'
  ]
};

// ─── AI scoring with Groq ─────────────────────────────────────
async function scoreInterviewWithGroq(interviewType, questionsAndAnswers) {
  const client = getGroq();
  if (!client) return null;

  const qaText = questionsAndAnswers
    .map((qa, i) => `Q${i + 1}: ${qa.question}\nA${i + 1}: ${qa.answer || '(No answer provided)'}`)
    .join('\n\n');

  const prompt = `You are an expert technical interviewer evaluating a candidate's mock interview responses.

Interview Type: ${interviewType}
Questions and Answers:
${qaText}

Evaluate the candidate's answers and return ONLY a valid JSON object (no markdown, no explanation):
{
  "confidence": <integer 0-100>,
  "communication": <integer 0-100>,
  "technicalAccuracy": <integer 0-100>,
  "clarity": <integer 0-100>,
  "strengths": ["specific strength 1", "specific strength 2", "specific strength 3"],
  "improvements": ["specific improvement 1", "specific improvement 2", "specific improvement 3"],
  "detailedFeedback": "2-3 sentences of overall personalized feedback about this specific interview performance"
}

Rules:
- Score each dimension 0–100 based strictly on the quality of answers given
- If no answers were provided, scores should be low (30–50)
- strengths and improvements must be specific to what the candidate actually said
- detailedFeedback must reference the actual content of the answers`;

  const completion = await client.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.4,
    max_tokens: 800
  });

  const raw = completion.choices[0]?.message?.content || '';
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('No JSON in Groq response');
  return JSON.parse(match[0]);
}

// ─── Fallback scoring (when no AI or no answers) ──────────────
function fallbackScore() {
  const base = () => Math.floor(Math.random() * 20) + 60; // 60–80
  return {
    confidence: base(),
    communication: base(),
    technicalAccuracy: base(),
    clarity: base(),
    strengths: [
      'Showed good understanding of core concepts.',
      'Communicated ideas in a structured manner.',
      'Demonstrated relevant technical knowledge.'
    ],
    improvements: [
      'Provide more specific real-world examples.',
      'Add more depth to technical explanations.',
      'Practice structuring answers using the STAR method.'
    ],
    detailedFeedback: 'Overall a decent interview performance. Focus on giving concrete examples and deeper technical explanations in future attempts.'
  };
}

// ─── GET /api/interview/questions ─────────────────────────────
router.get('/questions', auth, async (req, res) => {
  try {
    const { type = 'technical', count = 5 } = req.query;
    const pool = questionSets[type] || questionSets.technical;
    // Shuffle and pick `count` questions
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    res.json({ questions: shuffled.slice(0, parseInt(count)) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ─── POST /api/interview/submit ───────────────────────────────
router.post('/submit', auth, async (req, res) => {
  try {
    const { interviewType, questions, answers, duration } = req.body;

    // Build Q&A pairs for AI scoring
    const questionsAndAnswers = (questions || []).map((q, i) => ({
      question: typeof q === 'string' ? q : q.question || q,
      answer: answers?.[i] || ''
    }));

    let aiResult = null;
    const hasAnswers = questionsAndAnswers.some(qa => qa.answer && qa.answer.trim().length > 10);

    if (hasAnswers) {
      try {
        console.log('🤖 Scoring interview with Groq (llama-3.3-70b-versatile)...');
        aiResult = await scoreInterviewWithGroq(interviewType, questionsAndAnswers);
        console.log(`✅ Groq interview scoring complete — Overall: ${Math.round((aiResult.confidence + aiResult.communication + aiResult.technicalAccuracy + aiResult.clarity) / 4)}`);
      } catch (err) {
        console.error('Groq interview scoring failed, using fallback:', err.message);
        aiResult = fallbackScore();
      }
    } else {
      // No answers submitted — use fallback
      aiResult = fallbackScore();
    }

    const feedback = {
      confidence:       aiResult.confidence,
      communication:    aiResult.communication,
      technicalAccuracy: aiResult.technicalAccuracy,
      clarity:          aiResult.clarity
    };

    const overallScore = Math.round(
      (feedback.confidence + feedback.communication + feedback.technicalAccuracy + feedback.clarity) / 4
    );

    // Normalize questions to objects (supports both string[] and {question}[])
    const normalizedQuestions = (questions || []).map(q =>
      typeof q === 'string' ? { question: q } : q
    );

    // Save to DB
    const interviewFeedback = new InterviewFeedback({
      userId: req.userId,
      interviewType,
      questions: normalizedQuestions,
      overallScore,
      feedback,
      strengths:    aiResult.strengths,
      improvements: aiResult.improvements,
      duration
    });
    await interviewFeedback.save();

    // Update user stats
    const user = await User.findById(req.userId);
    if (user) {
      user.interviewsTaken = (user.interviewsTaken || 0) + 1;
      user.xp = (user.xp || 0) + overallScore;
      await user.save();
    }

    res.json({
      message: 'Interview submitted successfully',
      feedback: {
        overallScore,
        ...feedback,
        strengths:       aiResult.strengths,
        improvements:    aiResult.improvements,
        detailedFeedback: aiResult.detailedFeedback || null,
        aiPowered: !!aiResult.detailedFeedback
      }
    });
  } catch (error) {
    console.error('Interview submit error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ─── GET /api/interview/history ───────────────────────────────
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
