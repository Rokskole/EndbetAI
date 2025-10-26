const express = require('express');
const router = express.Router();
const axios = require('axios');

// In-memory chat history (replace with database in production)
const chatHistory = {};

// Handle chat messages
router.post('/', async (req, res) => {
    try {
        const { message, userId, context } = req.body;

        if (!message) {
            return res.status(400).json({ message: 'Message is required' });
        }

        // Get or initialize user's chat history
        if (!chatHistory[userId]) {
            chatHistory[userId] = [];
        }

        // System prompt for gambling recovery support
        const systemPrompt = `You are a compassionate AI assistant helping someone recover from gambling addiction. 
        Be supportive, understanding, and non-judgmental. Focus on:
        - Encouraging recovery steps
        - Providing practical advice
        - Offering emotional support
        - Suggesting healthy alternatives to gambling
        - Reminding users they're not alone
        Always remind users that you're not a substitute for professional therapy.`;

        // Call OpenAI API
        const openaiResponse = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: systemPrompt },
                    ...chatHistory[userId].slice(-10), // Last 10 messages for context
                    { role: 'user', content: message }
                ],
                temperature: 0.7,
                max_tokens: 500
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        const aiMessage = openaiResponse.data.choices[0].message.content;

        // Save to chat history
        chatHistory[userId].push(
            { role: 'user', content: message },
            { role: 'assistant', content: aiMessage }
        );

        // Limit history to last 50 messages
        if (chatHistory[userId].length > 50) {
            chatHistory[userId] = chatHistory[userId].slice(-50);
        }

        res.json({ 
            message: aiMessage,
            response: aiMessage // For compatibility
        });

    } catch (error) {
        console.error('Chat error:', error.response?.data || error.message);
        
        // Fallback response if OpenAI fails
        const fallbackResponses = [
            "I'm here to support you. Would you like to talk about what's on your mind?",
            "Remember, you're not alone in this journey. How can I help you today?",
            "I understand this is difficult. What do you need support with right now?"
        ];
        
        const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
        
        res.status(200).json({ 
            message: randomResponse,
            response: randomResponse
        });
    }
});

module.exports = router;

