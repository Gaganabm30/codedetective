import express from 'express';
import {
  getChallenges,
  getChallengeById,
  runChallengeCode,
  submitChallenge,
} from '../controllers/challengeController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getChallenges);
router.get('/:id', getChallengeById);
router.post('/:id/run', runChallengeCode);
router.post('/:id/submit', verifyToken, submitChallenge);

export default router;

