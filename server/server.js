import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load server/.env first, then fallback to current directory
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config();

import app from './app.js';
import { connectDB } from './config/db.js';

const PORT = process.env.PORT || 5000;

async function startServer() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`🚀 [CodeDetective Server] Running on http://localhost:${PORT}`);
    console.log(`🛡️ [Sandbox Engine] Isolated Node VM execution layer loaded.`);
    console.log(`🤖 [AI Mentor] Gemini Integration ready.`);
  });
}

startServer();
