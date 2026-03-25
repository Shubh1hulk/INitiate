const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  firstName: String,
  lastName: String,
  avatar: String,
  bio: String,

  // Digital Twin Training Data
  communicationStyle: {
    formality: { type: String, enum: ['formal', 'casual', 'mixed'] },
    tone: String, // e.g., "friendly", "professional", "humorous"
    vocabulary: [String], // Common words they use
    patterns: [String], // Speech patterns
  },

  personalityTraits: {
    riskTolerance: { type: Number, min: 1, max: 10 },
    decisionMaking: String, // "analytical", "intuitive", "balanced"
    optimism: { type: Number, min: 1, max: 10 },
    ambition: { type: Number, min: 1, max: 10 },
  },

  habits: [String],
  preferences: {
    career: [String],
    lifestyle: [String],
    values: [String],
  },

  trainingPhase: {
    type: String,
    enum: ['incomplete', 'basic', 'intermediate', 'advanced'],
    default: 'incomplete',
  },

  trainingDataPoints: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function (plainPassword) {
  return await bcrypt.compare(plainPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
