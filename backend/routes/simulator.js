const express = require('express');
const authMiddleware = require('../middleware/auth');
const User = require('../models/User');
const Simulation = require('../models/Simulation');
const AIService = require('../services/AIService');

const router = express.Router();

// Generate new simulation
router.post('/simulate', authMiddleware, async (req, res) => {
  try {
    const { decision } = req.body;

    if (!decision) {
      return res.status(400).json({ message: 'Decision is required' });
    }

    const user = await User.findById(req.userId);

    // Check if user has enough training
    if (user.trainingPhase === 'incomplete') {
      return res.status(400).json({
        message: 'Please complete some digital twin training first',
      });
    }

    // Generate simulation using AI
    const simulationData = await AIService.generateSimulation(decision, user);

    // Create simulation record
    const simulation = new Simulation({
      userId: req.userId,
      decision,
      scenarios: simulationData.scenarios,
      personalizedInsights: simulationData.personalizedInsights,
      recommendation: simulationData.recommendation,
    });

    await simulation.save();

    res.status(201).json(simulation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user's simulations
router.get('/simulations', authMiddleware, async (req, res) => {
  try {
    const simulations = await Simulation.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(simulations);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get specific simulation
router.get('/simulation/:simulationId', authMiddleware, async (req, res) => {
  try {
    const simulation = await Simulation.findById(req.params.simulationId);

    if (!simulation || simulation.userId.toString() !== req.userId.toString()) {
      return res.status(404).json({ message: 'Simulation not found' });
    }

    res.json(simulation);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Save simulation
router.put('/simulation/:simulationId/save', authMiddleware, async (req, res) => {
  try {
    const simulation = await Simulation.findById(req.params.simulationId);

    if (!simulation || simulation.userId.toString() !== req.userId.toString()) {
      return res.status(404).json({ message: 'Simulation not found' });
    }

    simulation.savedAt = new Date();
    await simulation.save();

    res.json(simulation);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Compare simulations
router.post('/compare', authMiddleware, async (req, res) => {
  try {
    const { simulationIds } = req.body;

    const simulations = await Simulation.find({
      _id: { $in: simulationIds },
      userId: req.userId,
    });

    res.json({
      simulations,
      comparison: {
        bestOutcome: simulations[0]?.recommendation || 'N/A',
        averageConfidence:
          simulations.reduce(
            (sum, sim) =>
              sum +
              (sim.scenarios.reduce((s, sc) => s + sc.confidence, 0) /
                sim.scenarios.length),
            0
          ) / simulations.length,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
