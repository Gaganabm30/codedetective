import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import challengeRoutes from './routes/challengeRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import leaderboardRoutes from './routes/leaderboardRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// Enable CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body Parser
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api', leaderboardRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    platform: 'CodeDetective Engine',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    sandbox: 'Node VM Isolated',
  });
});

// Global Error Handler
app.use(errorHandler);

export default app;

