const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Validate required environment variables
const REQUIRED_ENV = ['JWT_SECRET', 'MONGODB_URI'];
const missingEnv = REQUIRED_ENV.filter(key => !process.env[key]);
if (missingEnv.length > 0) {
  console.error(`❌ Missing environment variables: ${missingEnv.join(', ')}`);
  if (require.main === module) {
    console.error('   Add these to your .env file or Vercel environment settings.');
    process.exit(1);
  }
}

// Optional env var warnings
if (process.env.GROQ_API_KEY) {
  console.log('✅ Groq API key loaded — AI features enabled (llama-3.3-70b-versatile)');
} else {
  console.warn('⚠️  GROQ_API_KEY not set — AI features will use offline fallback');
}
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  console.warn('⚠️  GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET not set — Google OAuth disabled');
}

// ─── MongoDB connection cache (critical for Vercel serverless) ────────────────
// Vercel spins up a new Lambda for each request. Without caching, every request
// opens a fresh DB connection and may time out before it's ready.
let cachedConnection = null;

async function connectDB() {
  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection;
  }
  try {
    cachedConnection = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      connectTimeoutMS: 10000,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: 5,
    });
    console.log('✅ MongoDB Connected');
    return cachedConnection;
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
    cachedConnection = null;
    return null;
  }
}

// Import routes
const authRoutes = require('./backend/routes/auth');
const testRoutes = require('./backend/routes/tests');
const codingRoutes = require('./backend/routes/coding');
const resumeRoutes = require('./backend/routes/resume');
const interviewRoutes = require('./backend/routes/interview');
const leaderboardRoutes = require('./backend/routes/leaderboard');
const userRoutes = require('./backend/routes/user');

const app = express();

// CORS — allow all origins (Vercel handles edge security), configurable via CORS_ORIGIN
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
  : null;

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (!allowedOrigins) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: origin '${origin}' not allowed`));
  },
  credentials: true
}));

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// ─── DB connect middleware (ensures connection before API calls) ───────────────
app.use('/api', async (req, res, next) => {
  await connectDB();
  next();
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/coding', codingRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/user', userRoutes);

// ─── Static files ─────────────────────────────────────────────────────────────
const publicDir = path.join(__dirname, 'public');
app.use(express.static(publicDir));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Explicit HTML page routes
app.get(['/login', '/login.html'], (req, res) => {
  res.sendFile(path.join(publicDir, 'login.html'));
});
app.get(['/signup', '/signup.html'], (req, res) => {
  res.sendFile(path.join(publicDir, 'signup.html'));
});
app.get(['/dashboard', '/dashboard.html'], (req, res) => {
  res.sendFile(path.join(publicDir, 'dashboard.html'));
});

// Fallback: serve index for all other unmatched routes
app.get('*', (req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

// ─── Start server locally ─────────────────────────────────────────────────────
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  });
}

module.exports = app;
