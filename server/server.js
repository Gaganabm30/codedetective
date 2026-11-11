import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import { connectDB } from './config/db.js';

const PORT = process.env.PORT || 5000;

async function startServer() {
  await connectDB();

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 [CodeDetective Server] Running on http://localhost:${PORT}`);
    console.log(`🛡️ [Sandbox Engine] Isolated Node VM execution layer loaded.`);
    console.log(`🤖 [AI Mentor] Gemini Integration ready.`);
  });
}

startServer();
