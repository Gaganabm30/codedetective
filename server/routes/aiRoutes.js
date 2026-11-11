import express from 'express';
import { askMentor, getHint, explainError } from '../controllers/aiController.js';

const router = express.Router();

router.post('/mentor', askMentor);
router.post('/hint', getHint);
router.post('/explain-error', explainError);

export default router;

