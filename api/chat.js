const express = require('express');
const OpenAI = require('openai');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { message, history = [] } = req.body;
    
    // Validate input
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required and must be a non-empty string' });
    }

    if (!Array.isArray(history)) {
      return res.status(400).json({ error: 'History must be an array' });
    }

    // Validate history format
    for (const msg of history) {
      if (!msg.role || !msg.content || typeof msg.content !== 'string') {
        return res.status(400).json({ error: 'Invalid history format' });
      }
      if (!['user', 'assistant', 'system'].includes(msg.role)) {
        return res.status(400).json({ error: 'Invalid message role in history' });
      }
    }

    // Trim message and limit length
    const trimmedMessage = message.trim().substring(0, 1000); // Limit to 1000 chars

    // Add user message to history
    const updatedHistory = [...history, { role: 'user', content: trimmedMessage }];

    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: 'OpenAI API key not configured' });
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: updatedHistory,
      max_tokens: 500, // Limit response length
      temperature: 0.7,
    });

    const reply = completion.choices?.[0]?.message?.content?.trim() || 'No response generated';

    // Add assistant reply to history
    updatedHistory.push({ role: 'assistant', content: reply });

    return res.json({ reply, history: updatedHistory });
  } catch (err) {
    console.error('Chat error:', err);
    
    // Handle specific OpenAI errors
    if (err.code === 'insufficient_quota') {
      return res.status(503).json({ error: 'OpenAI quota exceeded. Please try again later.' });
    }
    if (err.code === 'invalid_api_key') {
      return res.status(500).json({ error: 'Invalid OpenAI API key configuration' });
    }
    
    return res.status(500).json({ error: 'Unable to process chat request. Please try again.' });
  }
});

module.exports = router;
