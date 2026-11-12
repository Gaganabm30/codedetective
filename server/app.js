import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import challengeRoutes from './routes/challengeRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import leaderboardRoutes from './routes/leaderboardRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { getDbHealth } from './config/db.js';

const app = express();

// Security Headers Middleware (Helmet standards)
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// Configure CORS with credentials support for HttpOnly cookies
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5173',
  'http://[::1]:3000',
  'http://[::1]:5173',
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        origin.startsWith('http://localhost:') ||
        origin.startsWith('http://127.0.0.1:') ||
        origin.startsWith('http://[::1]:')
      ) {
        callback(null, true);
      } else {
        callback(null, origin);
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// Lightweight Cookie Parser Middleware (Zero external dependencies)
app.use((req, res, next) => {
  req.cookies = {};
  if (req.headers.cookie) {
    const rawCookies = req.headers.cookie.split(';');
    for (const cookie of rawCookies) {
      const parts = cookie.split('=');
      const key = parts.shift().trim();
      if (key) {
        req.cookies[key] = decodeURIComponent(parts.join('='));
      }
    }
  }
  next();
});

// Body Parser
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api', leaderboardRoutes);

// Health check with DB status
app.get('/api/health', (req, res) => {
  const dbHealth = getDbHealth();
  res.json({
    status: 'online',
    platform: 'CodeDetective Engine',
    database: dbHealth,
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    sandbox: 'Node VM Isolated',
  });
});

// Global Error Handler
app.use(errorHandler);

export default app;
