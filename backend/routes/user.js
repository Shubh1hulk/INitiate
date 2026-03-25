const express = require('express');
const authMiddleware = require('../middleware/auth');
const User = require('../models/User');
const TrainingData = require('../models/TrainingData');
const AIService = require('../services/AIService');

const router = express.Router();

// Get user profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.userId,
      req.body,
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add training data (chat, voice, quiz)
router.post('/training-data', authMiddleware, async (req, res) => {
  try {
    const { type, content } = req.body;

    const trainingData = new TrainingData({
      userId: req.userId,
      type,
      content,
      metadata: {
        keywords: content.split(' ').slice(0, 10),
      },
    });

    await trainingData.save();

    // Update training phase and counter
    const user = await User.findById(req.userId);
    user.trainingDataPoints = (user.trainingDataPoints || 0) + 1;

    if (user.trainingDataPoints < 5) {
      user.trainingPhase = 'basic';
    } else if (user.trainingDataPoints < 15) {
      user.trainingPhase = 'intermediate';
    } else {
      user.trainingPhase = 'advanced';
    }

    await user.save();

    res.status(201).json(trainingData);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Analyze personality (triggered after training)
router.post('/analyze-personality', authMiddleware, async (req, res) => {
  try {
    const trainingDataList = await TrainingData.find({ userId: req.userId });

    if (trainingDataList.length === 0) {
      return res.status(400).json({ message: 'No training data available' });
    }

    const trainingContent = trainingDataList.map((td) => td.content);
    const analysis = await AIService.analyzePersonality(trainingContent);

    const user = await User.findById(req.userId);
    user.communicationStyle = analysis.communicationStyle;
    user.personalityTraits = analysis.personalityTraits;
    user.trainingPhase = 'advanced';

    await user.save();

    res.json({
      message: 'Personality analysis completed',
      analysis,
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
