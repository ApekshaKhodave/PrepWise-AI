const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./backend/routes/auth');
const testRoutes = require('./backend/routes/tests');
const codingRoutes = require('./backend/routes/coding');
const resumeRoutes = require('./backend/routes/resume');
const interviewRoutes = require('./backend/routes/interview');
const leaderboardRoutes = require('./backend/routes/leaderboard');
const userRoutes = require('./backend/routes/user');

const app = express();

// Middleware
app.use(cors());

app.use(express.raw({
  type: ['application/json', 'application/*+json'],
  limit: '1mb'
}));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

app.use((req, res, next) => {
  if (req.is('application/json') && Buffer.isBuffer(req.body)) {
    const raw = req.body.toString('utf8');
    try {
      req.body = raw ? JSON.parse(raw) : {};
    } catch (err) {
      console.error('Invalid JSON body received:', raw);
      return res.status(400).json({ error: 'Invalid JSON body' });
    }
  }
  next();
});

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/coding', codingRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/user', userRoutes);

// Serve frontend pages
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
.then(() => console.log('✅ MongoDB Connected'))
.catch((err) => {
  console.error('❌ MongoDB Connection Error:', err.message);
  console.log('⚠️  Running in demo mode without database');
});

// Start server only when running locally
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
