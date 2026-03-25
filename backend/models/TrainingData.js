const mongoose = require('mongoose');

const TrainingDataSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['chat', 'voice', 'quiz', 'decision'],
    required: true,
  },
  content: String,
  metadata: {
    duration: Number, // in seconds
    sentiment: String, // positive, negative, neutral
    keywords: [String],
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('TrainingData', TrainingDataSchema);
