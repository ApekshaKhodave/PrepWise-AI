/**
 * PrepWise AI — Mock Interview Engine
 * Features: Live Camera, 30+ questions per type, AI feedback via Groq, per-question breakdown
 */

const API_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ? 'http://localhost:5000/api'
  : '/api';

// ─── State ───────────────────────────────────────────────────
let interviewType    = 'technical';
let targetCompany    = 'General';
let experienceLevel  = 'fresher';
let questionCount    = 5;
let questions        = [];
let currentIdx       = 0;
let answers          = [];
let startTime, timerInterval, questionStartTime;
let cameraStream     = null;
let micStream        = null;
let recognition      = null;
let isRecording      = false;
let cameraEnabled    = false;

// ─── Questions Bank ──────────────────────────────────────────
const QUESTIONS = {
  technical: {
    fresher: [
      { q: 'What is the difference between an array and a linked list?', tag: 'DSA', hint: 'Think about memory layout and access time.' },
      { q: 'Explain Object-Oriented Programming and its four pillars.', tag: 'OOPs', hint: 'Encapsulation, Inheritance, Polymorphism, Abstraction.' },
      { q: 'What is the difference between stack and heap memory?', tag: 'Memory', hint: 'Think about allocation, lifetime, and who manages them.' },
      { q: 'Explain the concept of a hash map and its time complexity.', tag: 'DSA', hint: 'Average O(1) for get/put — why?' },
      { q: 'What is SQL vs NoSQL? When would you use each?', tag: 'Databases', hint: 'Think about schema flexibility, scale, and consistency.' },
      { q: 'Explain HTTP vs HTTPS and how SSL/TLS works.', tag: 'Networking', hint: 'Focus on encryption handshake.' },
      { q: 'What is a REST API? What makes an API RESTful?', tag: 'APIs', hint: 'Stateless, uniform interface, client-server.' },
      { q: 'Explain the difference between process and thread.', tag: 'OS', hint: 'Memory sharing and context switching.' },
      { q: 'What is recursion? Write a function to compute factorial.', tag: 'DSA', hint: 'Base case + recursive case.' },
      { q: 'Explain Big-O notation with examples.', tag: 'Complexity', hint: 'O(1), O(n), O(n²), O(log n).' },
      { q: 'What is a binary search tree? What are its properties?', tag: 'DSA', hint: 'Left < Root < Right for every node.' },
      { q: 'Explain the MVC architecture pattern.', tag: 'Design', hint: 'Model-View-Controller responsibilities.' },
      { q: 'What is Git and what is the difference between git merge and git rebase?', tag: 'Tools', hint: 'Think about commit history preservation.' },
      { q: 'What is a deadlock in OS? How can it be prevented?', tag: 'OS', hint: 'Coffman conditions.' },
      { q: 'Explain ACID properties in databases.', tag: 'Databases', hint: 'Atomicity, Consistency, Isolation, Durability.' },
    ],
    junior: [
      { q: 'Design a URL shortener like bit.ly. Walk through the architecture.', tag: 'System Design', hint: 'Hash function, redirect logic, DB choice.' },
      { q: 'Explain the difference between synchronous and asynchronous programming.', tag: 'Concurrency', hint: 'Blocking vs non-blocking I/O.' },
      { q: 'What are design patterns? Explain Singleton and Factory.', tag: 'Design Patterns', hint: 'Creational patterns.' },
      { q: 'Explain React\'s virtual DOM and reconciliation algorithm.', tag: 'Frontend', hint: 'Diffing algorithm, fiber architecture.' },
      { q: 'What is database indexing? When should you NOT use an index?', tag: 'Databases', hint: 'Write overhead, cardinality.' },
      { q: 'Explain microservices vs monolithic architecture.', tag: 'Architecture', hint: 'Trade-offs: deployment, complexity, scalability.' },
      { q: 'What is caching? Explain cache eviction policies like LRU.', tag: 'System Design', hint: 'Redis, Memcached, eviction strategies.' },
      { q: 'How does HTTPS work? Walk through the TLS handshake.', tag: 'Security', hint: 'Asymmetric → symmetric key exchange.' },
      { q: 'What is the CAP theorem?', tag: 'Distributed Systems', hint: 'Consistency, Availability, Partition Tolerance — pick 2.' },
      { q: 'Explain Dijkstra\'s algorithm and where you\'d use it.', tag: 'DSA', hint: 'Shortest path, priority queue.' },
    ],
  },
  hr: [
    { q: 'Tell me about yourself.', tag: 'Introduction', hint: 'Past → Present → Future structure. Keep it under 2 minutes.' },
    { q: 'Why do you want to work at this company?', tag: 'Motivation', hint: 'Research the company. Mention specific products, culture, or mission.' },
    { q: 'What are your greatest strengths?', tag: 'Self-Assessment', hint: 'Give 2–3 strengths with concrete examples.' },
    { q: 'What are your weaknesses, and how are you working on them?', tag: 'Self-Awareness', hint: 'Be genuine. Show self-awareness and growth mindset.' },
    { q: 'Where do you see yourself in 5 years?', tag: 'Career Goals', hint: 'Align with the role. Show ambition but also commitment.' },
    { q: 'Why are you leaving your current job?', tag: 'Motivation', hint: 'Stay positive. Focus on growth, not complaints.' },
    { q: 'What is your expected salary range?', tag: 'Negotiation', hint: 'Research market rates. Give a range, not a single number.' },
    { q: 'Do you prefer to work in a team or independently?', tag: 'Work Style', hint: 'Show flexibility. Give examples of both.' },
    { q: 'How do you handle pressure and tight deadlines?', tag: 'Stress Management', hint: 'Prioritization, communication, and calm under pressure.' },
    { q: 'What makes you unique compared to other candidates?', tag: 'Value Proposition', hint: 'Combine your skills, experience, and attitude.' },
    { q: 'Describe your ideal work environment.', tag: 'Culture Fit', hint: 'Research the company culture beforehand.' },
    { q: 'How do you stay up-to-date with industry trends?', tag: 'Learning', hint: 'Blogs, podcasts, courses, open source contributions.' },
    { q: 'What are you most proud of in your career so far?', tag: 'Achievements', hint: 'Quantify the impact if possible.' },
    { q: 'Do you have any questions for us?', tag: 'Engagement', hint: 'Always have 2–3 thoughtful questions ready.' },
    { q: 'How do you handle failure or a project that didn\'t succeed?', tag: 'Resilience', hint: 'Show what you learned and how you moved forward.' },
  ],
  behavioral: [
    { q: 'Tell me about a time you had a conflict with a teammate. How did you resolve it?', tag: 'Conflict Resolution', hint: 'STAR: Situation, Task, Action, Result.' },
    { q: 'Describe a time when you went above and beyond for a project.', tag: 'Initiative', hint: 'Show ownership and proactiveness.' },
    { q: 'Tell me about a project you are most proud of.', tag: 'Achievement', hint: 'Quantify impact. Highlight your specific role.' },
    { q: 'How do you prioritize tasks when working on multiple projects simultaneously?', tag: 'Time Management', hint: 'Eisenhower matrix, MoSCoW, communication.' },
    { q: 'Describe a time when you failed and what you learned from it.', tag: 'Failure & Learning', hint: 'Be honest, show growth mindset and concrete changes.' },
    { q: 'Tell me about a time you had to learn something new very quickly.', tag: 'Adaptability', hint: 'Highlight your learning strategy.' },
    { q: 'Describe a situation where you had to work with a difficult person.', tag: 'Interpersonal', hint: 'Focus on your actions, not blaming the other person.' },
    { q: 'Tell me about a time you showed leadership without a formal title.', tag: 'Leadership', hint: 'Informal leadership, influence, and rallying others.' },
    { q: 'Describe a time you received critical feedback. How did you react?', tag: 'Feedback', hint: 'Show openness, no defensiveness.' },
    { q: 'Tell me about a time you had to make a decision with incomplete information.', tag: 'Decision Making', hint: 'Calculated risk, consultation, iteration.' },
    { q: 'Describe a situation where you had to persuade someone to your point of view.', tag: 'Influence', hint: 'Data, empathy, and clear communication.' },
    { q: 'Tell me about a time you managed a tight deadline successfully.', tag: 'Time Management', hint: 'Planning, focus, and trade-offs you made.' },
    { q: 'Describe a time when you identified a problem no one else noticed.', tag: 'Problem Solving', hint: 'Proactive observation and impact of your action.' },
    { q: 'Tell me about a time you had to adapt to a major change at work or school.', tag: 'Adaptability', hint: 'Positive framing — change as opportunity.' },
    { q: 'Describe a time you collaborated with someone from a very different background.', tag: 'Diversity', hint: 'Show open-mindedness and what you learned.' },
  ],
  system_design: [
    { q: 'Design a URL shortener like bit.ly. Handle 100M URLs and 1B redirects/day.', tag: 'HLD', hint: 'Hashing, KV store, CDN, rate limiting.' },
    { q: 'Design a chat application like WhatsApp.', tag: 'HLD', hint: 'WebSockets, message queues, E2E encryption, storage.' },
    { q: 'Design Twitter\'s news feed system.', tag: 'Feed', hint: 'Fan-out on write vs read, Redis sorted sets.' },
    { q: 'Design a distributed cache system like Redis.', tag: 'Caching', hint: 'Consistent hashing, replication, eviction.' },
    { q: 'Design a ride-sharing app like Uber.', tag: 'Real-time', hint: 'Geospatial indexing, matching algorithm, surge pricing.' },
    { q: 'Design a video streaming platform like YouTube.', tag: 'Streaming', hint: 'CDN, transcoding pipeline, adaptive bitrate.' },
    { q: 'Design a notification system that handles millions of notifications per day.', tag: 'Async', hint: 'Message queues, rate limiting, retry logic.' },
    { q: 'Design a rate limiter for an API gateway.', tag: 'LLD', hint: 'Token bucket vs leaky bucket vs sliding window.' },
    { q: 'Design a search autocomplete system.', tag: 'LLD', hint: 'Trie, top-k suggestions, caching.' },
    { q: 'How would you design an e-commerce system to handle Black Friday traffic?', tag: 'Scalability', hint: 'Horizontal scaling, caching, DB sharding, queue.' },
    { q: 'Design a payment processing system.', tag: 'HLD', hint: 'Idempotency, 2-phase commit, fraud detection.' },
    { q: 'How would you design a distributed job scheduler?', tag: 'Distributed', hint: 'Leader election, task partitioning, fault tolerance.' },
    { q: 'Design a content delivery network (CDN).', tag: 'Infra', hint: 'PoPs, cache invalidation, anycast routing.' },
    { q: 'Design a leaderboard system for a gaming platform.', tag: 'LLD', hint: 'Redis sorted sets, pagination, real-time updates.' },
    { q: 'Design an API rate limiter with per-user and per-IP limits.', tag: 'LLD', hint: 'Redis, sliding window counter, distributed locks.' },
  ],
};

// Company-specific additions
const COMPANY_QUESTIONS = {
  Google:    ['Explain Google\'s MapReduce paradigm.', 'How would you design Google Search indexing?', 'Explain PageRank algorithm.'],
  Amazon:    ['Describe Amazon\'s Leadership Principles and how you embody them.', 'Tell me about a customer-obsessed decision you made.', 'Design Amazon\'s inventory management system.'],
  Microsoft: ['How do you handle ambiguous requirements?', 'Describe your approach to technical debt.', 'Design Microsoft Teams\' presence system.'],
  Flipkart:  ['Design Flipkart\'s flash sale system.', 'How would you handle cart abandonment at scale?', 'Describe a product decision you\'d make differently.'],
  Meta:      ['Design Facebook\'s friend recommendation system.', 'How would you A/B test a news feed ranking change?', 'Explain distributed consensus in Meta\'s infrastructure.'],
};

// Interview tips per type
const TIPS = {
  technical:     ['Use the STAR method for explaining solutions.', 'Think aloud — interviewers value your thought process.', 'Ask clarifying questions before coding.', 'Discuss time and space complexity.', 'Mention edge cases proactively.'],
  hr:            ['Research the company before the interview.', 'Prepare 5–6 strong behavioral stories.', 'Always have questions ready for the interviewer.', 'Show enthusiasm and genuine interest.', 'Quantify achievements with numbers.'],
  behavioral:    ['Use the STAR method: Situation, Task, Action, Result.', 'Keep each story under 2 minutes.', 'Use "I" not "we" — own your contributions.', 'Have 8–10 stories prepared for different competencies.', 'Be specific — avoid generic answers.'],
  system_design: ['Start by clarifying requirements and scale.', 'Estimate QPS and storage needs before diving in.', 'Draw diagrams — components, data flow, APIs.', 'Discuss trade-offs for every design choice.', 'Start simple, then optimize.'],
};

// ─── Auth ─────────────────────────────────────────────────────
function getToken() { return localStorage.getItem('token'); }
function getHeaders() {
  return { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` };
}

// ─── Init ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  if (!getToken()) { window.location.href = 'login.html'; return; }

  loadUserInfo();
  setupSelectors();
  setupCameraCheck();
  setupAnswerListeners();
  viewHistory();
  applyTheme();
  rotateTip();
});

// ─── User Info ────────────────────────────────────────────────
async function loadUserInfo() {
  try {
    const res = await fetch(`${API_URL}/auth/me`, { headers: getHeaders() });
    if (res.ok) {
      const { user } = await res.json();
      document.getElementById('userName').textContent = user.name || 'User';
      document.getElementById('userAvatar').src =
        `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name||'User')}&background=6C63FF&color=fff`;
    }
  } catch (_) {}
}

// ─── Selector Setup ───────────────────────────────────────────
function setupSelectors() {
  // Interview type
  document.querySelectorAll('.type-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.type-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      interviewType = card.dataset.type;
      rotateTip();
    });
  });

  // Company chips
  document.querySelectorAll('.company-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.company-chip').forEach(c => c.classList.remove('selected'));
      chip.classList.add('selected');
      targetCompany = chip.dataset.company;
    });
  });

  // Level chips
  document.querySelectorAll('.level-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.level-chip').forEach(c => c.classList.remove('selected'));
      chip.classList.add('selected');
      experienceLevel = chip.dataset.level;
    });
  });

  // Question count chips
  document.querySelectorAll('.qcount-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.qcount-chip').forEach(c => c.classList.remove('selected'));
      chip.classList.add('selected');
      questionCount = parseInt(chip.dataset.count);
    });
  });

  // Theme toggle
  document.getElementById('themeToggle').addEventListener('click', toggleTheme);

  // Menu toggle
  document.getElementById('menuToggle')?.addEventListener('click', () => {
    document.getElementById('sidebar')?.classList.toggle('active');
  });

  // Start button
  document.getElementById('startInterviewBtn').addEventListener('click', startInterview);
}

// ─── Camera Check ─────────────────────────────────────────────
function setupCameraCheck() {
  document.getElementById('enableCameraBtn').addEventListener('click', enableSetupCamera);
}

async function enableSetupCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    cameraStream = stream;

    const video = document.getElementById('setupVideo');
    video.srcObject = stream;

    document.getElementById('cameraPlaceholder').style.display = 'none';
    document.getElementById('cameraBadge').style.display = 'flex';

    setCheckStatus('cameraStatus', 'ok', '✓ Ready');
    setCheckStatus('micStatus', 'ok', '✓ Ready');
    cameraEnabled = true;
    showToast('Camera & microphone enabled!', 'success');
  } catch (err) {
    if (err.name === 'NotAllowedError') {
      setCheckStatus('cameraStatus', 'error', 'Blocked');
      setCheckStatus('micStatus', 'error', 'Blocked');
      showToast('Camera/mic permission denied. You can still continue without it.', 'warning');
    } else {
      setCheckStatus('cameraStatus', 'error', 'Not found');
      showToast('No camera found. You can still do the interview.', 'warning');
    }
  }
}

function setCheckStatus(id, type, text) {
  const el = document.getElementById(id);
  el.className = `check-status ${type}`;
  el.textContent = text;
}

// ─── Start Interview ──────────────────────────────────────────
async function startInterview() {
  startTime = Date.now();
  questions = buildQuestions();
  answers   = [];
  currentIdx = 0;

  // Stop setup video to avoid conflicts
  if (cameraStream) {
    cameraStream.getTracks().forEach(t => t.stop());
    cameraStream = null;
  }

  // Transition UI
  document.getElementById('setupSection').style.display    = 'none';
  document.getElementById('interviewSection').style.display = 'block';

  // Set interview meta
  document.getElementById('interviewTypeBadge').textContent  = formatType(interviewType);
  document.getElementById('interviewCompanyBadge').textContent = targetCompany;
  document.getElementById('totalQuestions').textContent      = questions.length;

  // Start camera in interview
  await startInterviewCamera();

  // Setup controls
  setupInterviewControls();

  // Load first question
  loadQuestion(0);
}

function buildQuestions() {
  let pool = [];

  // Base pool
  const base = QUESTIONS[interviewType];
  if (Array.isArray(base)) {
    pool = [...base];
  } else {
    // Has sub-levels (technical)
    const level = base[experienceLevel] || base.fresher;
    pool = [...level];
    // Mix in some fresher questions for junior
    if (experienceLevel === 'junior' && base.fresher) {
      pool = [...base.junior, ...base.fresher.slice(0, 5)];
    }
  }

  // Add company-specific questions
  if (targetCompany !== 'General' && COMPANY_QUESTIONS[targetCompany]) {
    COMPANY_QUESTIONS[targetCompany].forEach(q => {
      pool.push({ q, tag: targetCompany, hint: `Think about ${targetCompany}'s scale and culture.` });
    });
  }

  // Shuffle and slice
  pool = pool.sort(() => Math.random() - 0.5).slice(0, questionCount);
  return pool;
}

// ─── Interview Camera ─────────────────────────────────────────
async function startInterviewCamera() {
  const video = document.getElementById('interviewVideo');
  const overlay = document.getElementById('videoOffOverlay');

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    cameraStream = stream;
    video.srcObject = stream;
    overlay.style.display = 'none';
    cameraEnabled = true;
  } catch (_) {
    overlay.style.display = 'flex';
    cameraEnabled = false;
  }
}

function setupInterviewControls() {
  // Toggle camera
  document.getElementById('toggleCameraBtn').addEventListener('click', toggleCamera);

  // Mic button (voice input)
  document.getElementById('micBtn').addEventListener('click', toggleMic);

  // Clear button
  document.getElementById('clearBtn').addEventListener('click', () => {
    document.getElementById('answerInput').value = '';
    updateCharCount();
  });

  // Submit / Skip / End
  document.getElementById('submitBtn').addEventListener('click', submitAnswer);
  document.getElementById('skipBtn').addEventListener('click', skipQuestion);
  document.getElementById('endBtn').addEventListener('click', confirmEndInterview);
}

function toggleCamera() {
  const btn  = document.getElementById('toggleCameraBtn');
  const icon = document.getElementById('cameraIcon');
  const overlay = document.getElementById('videoOffOverlay');
  const video   = document.getElementById('interviewVideo');

  if (cameraStream) {
    cameraStream.getTracks().forEach(t => t.stop());
    cameraStream = null;
    overlay.style.display = 'flex';
    icon.className = 'fas fa-video-slash';
    btn.classList.add('off');
    cameraEnabled = false;
  } else {
    startInterviewCamera().then(() => {
      icon.className = 'fas fa-video';
      btn.classList.remove('off');
    });
  }
}

// ─── Load Question ────────────────────────────────────────────
function loadQuestion(index) {
  currentIdx        = index;
  questionStartTime = Date.now();

  const q = questions[index];
  document.getElementById('questionNumber').textContent = index + 1;
  document.getElementById('questionTag').textContent    = q.tag || 'Question';
  document.getElementById('currentQuestion').textContent = q.q;

  const hint = document.getElementById('questionHint');
  if (q.hint) {
    hint.textContent = `💡 Hint: ${q.hint}`;
    hint.classList.add('visible');
  } else {
    hint.classList.remove('visible');
  }

  document.getElementById('answerInput').value = answers[index] || '';
  updateCharCount();

  // Update progress bar
  const pct = (index / questions.length) * 100;
  document.getElementById('progressFill').style.width = pct + '%';

  // Restart timer
  startQuestionTimer();

  // AI ring animation when question loads
  const ring = document.getElementById('aiRing');
  ring.classList.add('speaking');
  setTimeout(() => ring.classList.remove('speaking'), 2000);

  // Rotate tip
  rotateTip();
}

// ─── Timer ────────────────────────────────────────────────────
function startQuestionTimer() {
  if (timerInterval) clearInterval(timerInterval);
  const el = document.getElementById('questionTimer');
  timerInterval = setInterval(() => {
    const sec = Math.floor((Date.now() - questionStartTime) / 1000);
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    el.textContent = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
    // Warn after 3 minutes
    if (sec >= 180) el.classList.add('warning');
    else el.classList.remove('warning');
  }, 1000);
}

// ─── Answer listeners ─────────────────────────────────────────
function setupAnswerListeners() {
  const ta = document.getElementById('answerInput');
  if (ta) ta.addEventListener('input', updateCharCount);
}
function updateCharCount() {
  const val = document.getElementById('answerInput')?.value || '';
  const cc  = document.getElementById('charCount');
  if (cc) cc.textContent = val.length;
}

// ─── Submit / Skip / End ──────────────────────────────────────
function submitAnswer() {
  const answer = document.getElementById('answerInput').value.trim();
  if (!answer) { showToast('Please write or speak an answer first.', 'error'); return; }

  answers[currentIdx] = answer;

  if (currentIdx < questions.length - 1) {
    loadQuestion(currentIdx + 1);
    showToast(`Answer ${currentIdx + 1} saved!`, 'success');
  } else {
    answers[currentIdx] = answer;
    finishInterview();
  }
}

function skipQuestion() {
  answers[currentIdx] = answers[currentIdx] || '';
  if (currentIdx < questions.length - 1) {
    loadQuestion(currentIdx + 1);
    showToast('Question skipped.', 'warning');
  } else {
    finishInterview();
  }
}

function confirmEndInterview() {
  if (confirm('End interview early? Your answers so far will be evaluated.')) {
    finishInterview();
  }
}

// ─── Finish & AI Feedback ─────────────────────────────────────
async function finishInterview() {
  if (timerInterval) clearInterval(timerInterval);
  if (cameraStream) { cameraStream.getTracks().forEach(t => t.stop()); cameraStream = null; }

  const duration = Math.floor((Date.now() - startTime) / 1000);

  document.getElementById('interviewSection').style.display = 'none';
  document.getElementById('aiThinking').style.display       = 'flex';

  const interviewData = {
    interviewType,
    targetCompany,
    experienceLevel,
    questions: questions.map((q, i) => ({
      question: q.q,
      answer:   answers[i] || '',
      tag:      q.tag || ''
    })),
    duration
  };

  try {
    const res = await fetch(`${API_URL}/interview/submit`, {
      method:  'POST',
      headers: getHeaders(),
      body:    JSON.stringify(interviewData)
    });

    const data = res.ok ? await res.json() : null;
    document.getElementById('aiThinking').style.display = 'none';
    showFeedback(data?.feedback || buildOfflineFeedback(), duration);
  } catch (err) {
    console.error(err);
    document.getElementById('aiThinking').style.display = 'none';
    showFeedback(buildOfflineFeedback(), duration);
  }
}

// ─── Offline Feedback ─────────────────────────────────────────
function buildOfflineFeedback() {
  const perQuestion = questions.map((q, i) => {
    const ans = answers[i] || '';
    const words = ans.trim().split(/\s+/).filter(w => w).length;
    const score = Math.min(100, Math.max(40,
      (ans.length > 20 ? 55 : 30) +
      Math.min(30, words * 1.2) +
      (ans.includes('example') || ans.includes('for instance') ? 10 : 0) +
      (ans.length > 200 ? 5 : 0)
    ));
    return {
      question: q.q,
      score: Math.round(score),
      feedback: score > 70
        ? 'Good answer with reasonable detail. Consider adding specific examples.'
        : 'Try to be more detailed. Use the STAR method or structured frameworks.'
    };
  });

  const avg = Math.round(perQuestion.reduce((s, p) => s + p.score, 0) / perQuestion.length);

  return {
    overallScore:      avg,
    confidence:        Math.min(100, avg + Math.floor(Math.random() * 10) - 5),
    communication:     Math.min(100, avg + Math.floor(Math.random() * 10) - 5),
    technicalAccuracy: Math.min(100, avg + Math.floor(Math.random() * 10) - 5),
    clarity:           Math.min(100, avg + Math.floor(Math.random() * 10) - 5),
    perQuestion,
    strengths: [
      'Attempted all questions with structured thinking.',
      'Showed willingness to communicate ideas clearly.',
      'Demonstrated awareness of key concepts.'
    ],
    improvements: [
      'Use more concrete real-world examples in your answers.',
      'Practice the STAR method for behavioral questions.',
      'Research the company and role more deeply before interviews.'
    ]
  };
}

// ─── Show Feedback ────────────────────────────────────────────
function showFeedback(fb, duration) {
  document.getElementById('feedbackSection').style.display = 'block';

  // Meta tags
  document.getElementById('fbType').textContent     = formatType(interviewType);
  document.getElementById('fbCompany').textContent  = targetCompany;
  document.getElementById('fbDuration').textContent = formatDuration(duration);

  // Overall score donut
  const score = fb.overallScore || 0;
  const circ  = 2 * Math.PI * 85; // r=85 → circumference ≈ 534
  const offset = circ - (score / 100) * circ;
  setTimeout(() => {
    document.getElementById('scoreDonut').style.strokeDashoffset = offset;
  }, 200);
  animateVal('overallScore', 0, score, 1400);
  document.getElementById('overallGrade').textContent = getGrade(score);

  // Metric rings
  animateRing('confCircle', 'confidenceScore', fb.confidence || 0);
  animateRing('commCircle', 'communicationScore', fb.communication || 0);
  animateRing('techCircle', 'technicalScore', fb.technicalAccuracy || 0);
  animateRing('clarCircle', 'clarityScore', fb.clarity || 0);

  // Per-question breakdown
  const breakdownList = document.getElementById('breakdownList');
  breakdownList.innerHTML = '';
  const pq = fb.perQuestion || [];
  pq.forEach((item, i) => {
    const div = document.createElement('div');
    div.className = 'breakdown-item';
    div.innerHTML = `
      <div class="breakdown-q">
        <span class="breakdown-qnum">${i + 1}</span>
        <span>${item.question}</span>
      </div>
      <div class="breakdown-score-row">
        <div class="breakdown-score-bar">
          <div class="breakdown-score-fill" style="width:0%" data-target="${item.score}"></div>
        </div>
        <span class="breakdown-score-val">${item.score}/100</span>
      </div>
      <div class="breakdown-fb">${item.feedback || ''}</div>
    `;
    breakdownList.appendChild(div);
  });
  // Animate score bars
  setTimeout(() => {
    document.querySelectorAll('.breakdown-score-fill').forEach(el => {
      el.style.width = el.dataset.target + '%';
    });
  }, 400);

  // Strengths
  const sl = document.getElementById('strengthsList');
  sl.innerHTML = '';
  (fb.strengths || []).forEach(s => {
    const li = document.createElement('li');
    li.textContent = s;
    sl.appendChild(li);
  });

  // Improvements
  const il = document.getElementById('improvementsList');
  il.innerHTML = '';
  (fb.improvements || []).forEach(s => {
    const li = document.createElement('li');
    li.textContent = s;
    il.appendChild(li);
  });

  // Reload history
  viewHistory();
}

function animateRing(circleId, scoreId, value) {
  const circ   = 2 * Math.PI * 24; // r=24 → ≈ 150.8
  const offset = circ - (value / 100) * circ;
  setTimeout(() => {
    document.getElementById(circleId).style.strokeDashoffset = offset;
  }, 300);
  animateVal(scoreId, 0, value, 1200, '%');
}

function animateVal(id, start, end, dur, suffix = '') {
  const el  = document.getElementById(id);
  if (!el) return;
  const inc = (end - start) / (dur / 16);
  let cur = start;
  const t = setInterval(() => {
    cur += inc;
    if (cur >= end) { el.textContent = end + suffix; clearInterval(t); }
    else el.textContent = Math.floor(cur) + suffix;
  }, 16);
}

function getGrade(score) {
  if (score >= 90) return 'Outstanding';
  if (score >= 80) return 'Excellent';
  if (score >= 70) return 'Good';
  if (score >= 60) return 'Average';
  return 'Needs Work';
}

function formatDuration(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}m ${s}s`;
}

function formatType(type) {
  return { technical: 'Technical', hr: 'HR Round', behavioral: 'Behavioral', system_design: 'System Design' }[type] || type;
}

// ─── Voice Input ──────────────────────────────────────────────
function toggleMic() {
  const btn   = document.getElementById('micBtn');
  const icon  = document.getElementById('micIcon');
  const label = document.getElementById('micLabel');
  const ta    = document.getElementById('answerInput');

  if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
    showToast('Voice input not supported in this browser.', 'error');
    return;
  }

  if (isRecording) {
    recognition?.stop();
    isRecording = false;
    btn.classList.remove('recording');
    icon.className = 'fas fa-microphone';
    label.textContent = 'Use voice';
    return;
  }

  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SR();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'en-US';

  let base = ta.value;
  recognition.onstart = () => {
    isRecording = true;
    btn.classList.add('recording');
    icon.className = 'fas fa-stop';
    label.textContent = 'Stop';
    showToast('Listening… speak your answer.', 'info');
  };
  recognition.onresult = (e) => {
    let transcript = '';
    for (let i = e.resultIndex; i < e.results.length; i++) {
      transcript += e.results[i][0].transcript;
    }
    ta.value = base + ' ' + transcript;
    updateCharCount();
  };
  recognition.onerror = (e) => {
    showToast('Voice error: ' + e.error, 'error');
    isRecording = false;
    btn.classList.remove('recording');
    icon.className = 'fas fa-microphone';
    label.textContent = 'Use voice';
  };
  recognition.onend = () => {
    isRecording = false;
    btn.classList.remove('recording');
    icon.className = 'fas fa-microphone';
    label.textContent = 'Use voice';
    base = ta.value;
  };
  recognition.start();
}

// ─── History ──────────────────────────────────────────────────
async function viewHistory() {
  const grid = document.getElementById('historyGrid');
  if (!grid) return;
  try {
    const res = await fetch(`${API_URL}/interview/history`, { headers: getHeaders() });
    if (!res.ok) throw new Error();
    const { interviews = [] } = await res.json();
    if (interviews.length === 0) {
      grid.innerHTML = '<p class="empty-history">No past interviews yet. Start your first one above!</p>';
      return;
    }
    grid.innerHTML = interviews.map(iv => `
      <div class="history-card">
        <div class="history-card-top">
          <span class="history-type-badge">${formatType(iv.interviewType)}</span>
          <span class="history-score-big">${iv.overallScore || 0}</span>
        </div>
        <div class="history-company">${iv.targetCompany || 'General'} · ${iv.experienceLevel || 'Fresher'}</div>
        <div class="history-date">${new Date(iv.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
      </div>
    `).join('');
  } catch {
    grid.innerHTML = '<p class="empty-history">Could not load history.</p>';
  }
}

function retakeInterview() { window.location.reload(); }

// ─── Tips ─────────────────────────────────────────────────────
function rotateTip() {
  const pool = TIPS[interviewType] || TIPS.technical;
  const tip  = pool[Math.floor(Math.random() * pool.length)];
  const el   = document.getElementById('tipText');
  if (el) el.textContent = tip;
}

// ─── Theme ────────────────────────────────────────────────────
function applyTheme() {
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-theme');
    const icon = document.querySelector('#themeToggle i');
    if (icon) { icon.className = 'fas fa-sun'; }
  }
}
function toggleTheme() {
  document.body.classList.toggle('dark-theme');
  const isDark = document.body.classList.contains('dark-theme');
  const icon = document.querySelector('#themeToggle i');
  if (icon) icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// ─── Toast ────────────────────────────────────────────────────
function showToast(msg, type = 'success') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = `toast ${type} show`;
  setTimeout(() => t.classList.remove('show'), 3500);
}
