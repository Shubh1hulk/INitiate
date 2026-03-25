const express = require('express');
const authMiddleware = require('../middleware/auth');
const User = require('../models/User');
const ChatConversation = require('../models/ChatConversation');
const AIService = require('../services/AIService');

const router = express.Router();

// Create new chat conversation
router.post('/chat', authMiddleware, async (req, res) => {
  try {
    const { mode, title } = req.body;

    const conversation = new ChatConversation({
      userId: req.userId,
      mode: mode || 'twin',
      title: title || `Chat ${new Date().toLocaleDateString()}`,
      messages: [],
    });

    await conversation.save();
    res.status(201).json(conversation);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's chat conversations
router.get('/chats', authMiddleware, async (req, res) => {
  try {
    const conversations = await ChatConversation.find({ userId: req.userId })
      .sort({ updatedAt: -1 })
      .limit(20);

    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get specific chat conversation
router.get('/chat/:chatId', authMiddleware, async (req, res) => {
  try {
    const conversation = await ChatConversation.findById(req.params.chatId);

    if (!conversation || conversation.userId.toString() !== req.userId.toString()) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    res.json(conversation);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Send message and get AI response
router.post('/chat/:chatId/message', authMiddleware, async (req, res) => {
  try {
    const { content } = req.body;
    const conversation = await ChatConversation.findById(req.params.chatId);

    if (!conversation || conversation.userId.toString() !== req.userId.toString()) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Add user message
    conversation.messages.push({
      role: 'user',
      content,
    });

    // Get user profile for context
    const user = await User.findById(req.userId);

    // Generate AI response based on mode
    let aiResponse;
    if (conversation.mode === 'twin') {
      aiResponse = await AIService.generateTwinResponse(user, content);
    } else if (conversation.mode === 'advisor') {
      aiResponse = await AIService.generateTwinResponse(
        user,
        `As a mentor and life advisor: ${content}`
      );
    } else if (conversation.mode === 'future-self') {
      aiResponse = await AIService.generateTwinResponse(
        user,
        `As your future self who has succeeded, ${content}`
      );
    }

    // Add AI response
    conversation.messages.push({
      role: 'assistant',
      content: aiResponse,
    });

    conversation.updatedAt = new Date();
    await conversation.save();

    res.json({
      userMessage: content,
      aiResponse,
      conversation,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
