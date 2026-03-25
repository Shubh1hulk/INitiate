require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lifetwin')
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/user'));
app.use('/api/twin', require('./routes/twin'));
app.use('/api/simulator', require('./routes/simulator'));
app.use('/api/ml', require('./routes/ml'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'LifeTwin API is running' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`LifeTwin Backend running on http://localhost:${PORT}`);
  console.log('API Documentation:');
  console.log('POST /api/auth/register - Register new user');
  console.log('POST /api/auth/login - Login user');
  console.log('GET /api/user/profile - Get user profile');
  console.log('POST /api/user/training-data - Add training data');
  console.log('POST /api/user/analyze-personality - Analyze personality');
  console.log('POST /api/twin/chat - Create new chat');
  console.log('POST /api/twin/chat/:chatId/message - Send message');
  console.log('POST /api/simulator/simulate - Generate simulation');
  console.log('POST /api/ml/sentiment - Analyze sentiment (Python DL)');
  console.log('POST /api/ml/embedding - Generate embedding (SentenceTransformer)');
  console.log('POST /api/ml/semantic-search - Semantic retrieval (Python DL)');
  console.log('POST /api/ml/classifier/train - Train text classifier (scikit-learn)');
  console.log('POST /api/ml/classifier/predict - Predict text class (scikit-learn)');
});
