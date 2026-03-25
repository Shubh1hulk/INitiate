const mongoose = require('mongoose');

const ChatConversationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  mode: {
    type: String,
    enum: ['twin', 'advisor', 'future-self'],
    default: 'twin',
  },
  title: String,
  messages: [
    {
      role: { type: String, enum: ['user', 'assistant'] },
      content: String,
      timestamp: { type: Date, default: Date.now },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ChatConversation', ChatConversationSchema);
