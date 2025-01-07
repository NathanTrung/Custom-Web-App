const express = require('express');
const axios = require('axios');

const router = express.Router();
const chats = {}; // In-memory storage for chat data

// Get chat history
router.get('/', (req, res) => {
  res.status(200).json(Object.values(chats));
});

// Start a new chat
router.post('/', (req, res) => {
  const chatId = Date.now().toString(); // Unique chat ID
  chats[chatId] = { id: chatId, messages: [], createdAt: new Date() };
  res.status(201).json(chats[chatId]);
});


// Send a message
router.post('/:chatId/message', async (req, res) => {
  const { chatId } = req.params;
  const { role, content } = req.body;

  if (!chats[chatId]) {
    return res.status(404).json({ error: 'Chat not found' });
  }

  // Add user message to chat history
  chats[chatId].messages.push({ role, content });

  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/cardiffnlp/twitter-roberta-base-sentiment-latest",
      {
          method: "POST",
          headers: {
              Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
              "Content-Type": "application/json",
          },
          body: JSON.stringify({ inputs: "Test input" }),
      }
  );
  

    if (response.data?.error === 'Model microsoft/DialoGPT-medium is currently loading') {
      return res.status(503).json({ error: 'Model is still loading. Please try again later.' });
    }

    // Create bot response
    const botMessage = {
      role: 'assistant',
      content: response.data.generated_text || 'Sorry, I couldn’t process your message.',
    };

    // Add bot message to chat history
    chats[chatId].messages.push(botMessage);

    return res.status(200).json(botMessage);
  } catch (error) {
    console.error('Error communicating with Hugging Face:', error.response?.data || error.message);

    // Return error response to frontend
    return res.status(500).json({ error: 'Error communicating with Hugging Face' });
  }
});


module.exports = router;
