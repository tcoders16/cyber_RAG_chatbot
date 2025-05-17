// server.js

import express from 'express';
import cors from 'cors';
import { queryFromUser } from './services/queryFromUser.js';
const app = express();
const PORT = 5001;

// Middleware setup
console.log('🔁 Setting up middleware...');
app.use(cors());
app.use(express.json());
console.log('✅ Middleware configured');

// Simple GET health check
app.get('/', (req, res) => {
  console.log('🌐 GET / hit');
  res.send('Hello from root route!');
});

// POST /api/chat — handles questions from frontend/curl/Postman
app.post('/api/chat', async (req, res) => {
  console.log('\n📥 POST /api/chat triggered');
  console.log('📦 Raw request body:', req.body);

  const userMessage = req.body.message;

  if (!userMessage) {
    console.log('❌ No message found in request');
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    // ✅ Send message to RAG/GPT handler
    const reply = await queryFromUser(userMessage);

    console.log('📤 GPT reply:', reply);
    res.status(200).json({ reply });
} catch (error) {
  console.error('❌ Error in queryFromUser:', error);
  res.status(500).json({ error: error.message || 'Internal Server Error' });
}
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});