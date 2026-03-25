const mongoose = require('mongoose');

const SimulationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  decision: String, // The original decision/question
  scenarios: [
    {
      title: String,
      description: String,
      probability: Number, // 0-100
      timeline: {
        shortTerm: String, // 0-6 months
        mediumTerm: String, // 6-18 months
        longTerm: String, // 18+ months
      },
      risks: [String],
      opportunities: [String],
      confidence: Number, // 0-100
    },
  ],
  personalizedInsights: String, // Tailored based on user's personality
  recommendation: String,
  createdAt: { type: Date, default: Date.now },
  savedAt: { type: Date, default: null },
});

module.exports = mongoose.model('Simulation', SimulationSchema);
