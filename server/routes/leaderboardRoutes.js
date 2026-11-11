import express from 'express';
import { getLeaderboard, getAttempts } from '../controllers/leaderboardController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/leaderboard', getLeaderboard);
router.get('/attempts', verifyToken, getAttempts);

export default router;

