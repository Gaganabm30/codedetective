import { askMentorAI, getProgressiveHint, explainErrorAI } from '../services/geminiService.js';
import Challenge from '../models/Challenge.js';
import { isDbConnected } from '../config/db.js';
import { SERVER_CHALLENGES } from '../utils/seedData.js';

export async function askMentor(req, res) {
  try {
    const { challengeId, message, code, context } = req.body;

    let challenge = null;
    if (isDbConnected()) {
      challenge = await Challenge.findOne({
        $or: [{ challengeId }, { id: challengeId }, { slug: challengeId }],
      });
    }
    if (!challenge) {
      challenge = SERVER_CHALLENGES.find(c => c.id === challengeId || c.challengeId === challengeId);
    }

    const reply = await askMentorAI({ challenge, message, code, context });
    return res.json({ success: true, reply });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export async function getHint(req, res) {
  try {
    const { challengeId, level, code } = req.body;

    let challenge = null;
    if (isDbConnected()) {
      challenge = await Challenge.findOne({
        $or: [{ challengeId }, { id: challengeId }],
      });
    }
    if (!challenge) {
      challenge = SERVER_CHALLENGES.find(c => c.id === challengeId || c.challengeId === challengeId);
    }

    const hint = await getProgressiveHint({ challenge, level: parseInt(level), code });
    return res.json({ success: true, hint });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export async function explainError(req, res) {
  try {
    const { challengeId, errorOutput, code } = req.body;

    let challenge = null;
    if (isDbConnected()) {
      challenge = await Challenge.findOne({
        $or: [{ challengeId }, { id: challengeId }],
      });
    }
    if (!challenge) {
      challenge = SERVER_CHALLENGES.find(c => c.id === challengeId || c.challengeId === challengeId);
    }

    const explanation = await explainErrorAI({ challenge, errorOutput, code });
    return res.json({ success: true, explanation });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

