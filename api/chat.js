const express = require('express');
const OpenAI = require('openai');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { message, history = [] } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Add user message to history
    const updatedHistory = [...history, { role: 'user', content: message }];

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: updatedHistory,
    });

    const reply = completion.choices?.[0]?.message?.content?.trim() || 'No response';

    // Add assistant reply to history
    updatedHistory.push({ role: 'assistant', content: reply });

    return res.json({ reply, history: updatedHistory });
  } catch (err) {
    console.error('Chat error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

module.exports = router;
