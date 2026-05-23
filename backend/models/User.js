const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  profilePhoto: {
    type: String,
    default: 'default-avatar.png'
  },
  college: {
    type: String,
    default: ''
  },
  branch: {
    type: String,
    default: ''
  },
  skills: [{
    name: String,
    level: Number
  }],
  xp: {
    type: Number,
    default: 0
  },
  streak: {
    type: Number,
    default: 0
  },
  lastActive: {
    type: Date,
    default: Date.now
  },
  testsCompleted: {
    type: Number,
    default: 0
  },
  codingProblemsolved: {
    type: Number,
    default: 0
  },
  resumeScore: {
    type: Number,
    default: 0
  },
  interviewsTaken: {
    type: Number,
    default: 0
  },
  achievements: [{
    title: String,
    icon: String,
    date: Date
  }],
  preferences: {
    theme: {
      type: String,
      default: 'light'
    },
    notifications: {
      type: Boolean,
      default: true
    }
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
