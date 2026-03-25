const express = require('express');
const authMiddleware = require('../middleware/auth');
const PythonMLService = require('../services/PythonMLService');

const router = express.Router();

router.get('/health', authMiddleware, async (req, res) => {
  try {
    const data = await PythonMLService.health();
    res.json(data);
  } catch (error) {
    res.status(502).json({ message: 'ML service unavailable', error: error.message });
  }
});

router.post('/classifier/train', authMiddleware, async (req, res) => {
  try {
    const { texts, labels } = req.body;
    const data = await PythonMLService.trainClassifier(texts, labels);
    res.json(data);
  } catch (error) {
    res.status(400).json({ message: 'Classifier training failed', error: error.message });
  }
});

router.post('/classifier/predict', authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;
    const data = await PythonMLService.predictClassifier(text);
    res.json(data);
  } catch (error) {
    res.status(400).json({ message: 'Prediction failed', error: error.message });
  }
});

router.post('/similarity', authMiddleware, async (req, res) => {
  try {
    const { query, candidates, topK } = req.body;
    const data = await PythonMLService.similarity(query, candidates, topK || 3);
    res.json(data);
  } catch (error) {
    res.status(400).json({ message: 'Similarity failed', error: error.message });
  }
});

router.post('/sentiment', authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;
    const data = await PythonMLService.sentiment(text);
    res.json(data);
  } catch (error) {
    res.status(400).json({ message: 'Sentiment failed', error: error.message });
  }
});

router.post('/embedding', authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;
    const data = await PythonMLService.embedding(text);
    res.json(data);
  } catch (error) {
    res.status(400).json({ message: 'Embedding failed', error: error.message });
  }
});

router.post('/embeddings', authMiddleware, async (req, res) => {
  try {
    const { texts } = req.body;
    const data = await PythonMLService.embeddings(texts);
    res.json(data);
  } catch (error) {
    res.status(400).json({ message: 'Embeddings failed', error: error.message });
  }
});

router.post('/semantic-search', authMiddleware, async (req, res) => {
  try {
    const { query, candidates, topK } = req.body;
    const data = await PythonMLService.semanticSearch(query, candidates, topK || 3);
    res.json(data);
  } catch (error) {
    res.status(400).json({ message: 'Semantic search failed', error: error.message });
  }
});

module.exports = router;
