import express from 'express';
import { register, login, getMe, logout } from '../controllers/authController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public auth endpoints
router.post('/register', register);
router.post('/login', login);

// Protected session endpoints
router.get('/me', verifyToken, getMe);
router.get('/profile', verifyToken, getMe); // Alias for compatibility
router.post('/logout', logout);

export default router;
