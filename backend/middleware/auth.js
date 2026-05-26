const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error('JWT_SECRET is not configured');
      return res.status(500).json({ error: 'JWT secret not configured' });
    }

    const decoded = jwt.verify(token, secret);
    
    // Try to find user with timeout
    const user = await User.findById(decoded.userId).maxTimeMS(10000).catch(() => null);

    if (!user) {
      // Demo mode - create mock user
      req.user = {
        _id: decoded.userId,
        name: 'Demo User',
        email: 'demo@prepwise.ai',
        xp: 5420,
        streak: 45,
        testsCompleted: 45,
        codingProblemsSolved: 128,
        resumeScore: 85,
        interviewsTaken: 12,
        profilePhoto: 'default-avatar.png',
        skills: [
          { name: 'JavaScript', level: 85 },
          { name: 'React', level: 78 },
          { name: 'Node.js', level: 72 },
          { name: 'MongoDB', level: 68 }
        ],
        achievements: []
      };
      req.userId = decoded.userId;
      return next();
    }

    req.user = user;
    req.userId = user._id;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = auth;
