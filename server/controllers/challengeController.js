import Challenge from '../models/Challenge.js';
import Attempt from '../models/Attempt.js';
import { executeCodeIsolated, evaluateChallengeTests } from '../services/executionService.js';
import { isDbConnected } from '../config/db.js';
import { SERVER_CHALLENGES } from '../utils/seedData.js';

export async function getChallenges(req, res) {
  try {
    const { category, difficulty, type, search } = req.query;

    let challenges = [];

    if (isDbConnected()) {
      const query = {};
      if (category && category !== 'All') query.category = category;
      if (difficulty && difficulty !== 'All') query.difficulty = difficulty;
      if (type && type !== 'All') query.type = type;
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { shortDescription: { $regex: search, $options: 'i' } },
        ];
      }
      challenges = await Challenge.find(query).select('-testCases.testRunnerCode');
    }

    if (!challenges || challenges.length === 0) {
      challenges = SERVER_CHALLENGES.filter(ch => {
        if (category && category !== 'All' && ch.category !== category) return false;
        if (difficulty && difficulty !== 'All' && ch.difficulty !== difficulty) return false;
        if (type && type !== 'All' && ch.type !== type) return false;
        if (search) {
          const q = search.toLowerCase();
          const match = ch.title.toLowerCase().includes(q) || ch.shortDescription.toLowerCase().includes(q);
          if (!match) return false;
        }
        return true;
      });
    }

    // Sanitize test runners so solutions aren't exposed
    const sanitized = challenges.map(c => {
      const plain = c.toObject ? c.toObject() : { ...c };
      if (plain.testCases) {
        plain.testCases = plain.testCases.map(tc => ({
          id: tc.id,
          name: tc.name,
          description: tc.description,
          hidden: tc.hidden,
        }));
      }
      return plain;
    });

    return res.json({ success: true, count: sanitized.length, data: sanitized });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export async function getChallengeById(req, res) {
  try {
    const { id } = req.params;

    let challenge = null;
    if (isDbConnected()) {
      challenge = await Challenge.findOne({
        $or: [{ challengeId: id }, { id }, { slug: id }],
      });
    }

    if (!challenge) {
      challenge = SERVER_CHALLENGES.find(c => c.id === id || c.slug === id || c.challengeId === id);
    }

    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    const plain = challenge.toObject ? challenge.toObject() : { ...challenge };
    // Keep test runners on server, expose only names and descriptions
    plain.testCases = (plain.testCases || []).map(tc => ({
      id: tc.id,
      name: tc.name,
      description: tc.description,
      hidden: tc.hidden,
    }));

    return res.json({ success: true, data: plain });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export async function runChallengeCode(req, res) {
  try {
    const { id } = req.params;
    const { files, entryPoint } = req.body;

    if (!files || !Array.isArray(files) || files.length === 0) {
      return res.status(400).json({ error: 'Files array required' });
    }

    const result = await executeCodeIsolated(files, entryPoint);
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export async function submitChallenge(req, res) {
  try {
    const { id } = req.params;
    const { files, timeSpent, hintsUsed } = req.body;

    let challenge = null;
    if (isDbConnected()) {
      challenge = await Challenge.findOne({
        $or: [{ challengeId: id }, { id }, { slug: id }],
      });
    }

    if (!challenge) {
      challenge = SERVER_CHALLENGES.find(c => c.id === id || c.slug === id || c.challengeId === id);
    }

    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    // Run test evaluation in isolated sandbox
    const evalResult = await evaluateChallengeTests(files, challenge.testCases);

    // Save attempt if DB connected
    if (isDbConnected() && req.user) {
      await Attempt.create({
        userId: req.user.id || 'usr_dev01',
        challengeId: challenge.id || challenge.challengeId,
        title: challenge.title,
        category: challenge.category,
        difficulty: challenge.difficulty,
        status: evalResult.allPassed ? 'PASSED' : 'FAILED',
        score: evalResult.score,
        testsPassed: evalResult.passedCount,
        testsTotal: evalResult.totalCount,
        timeSpent: timeSpent || '0s',
        hintsUsed: hintsUsed || 0,
        submittedFiles: files.map(f => ({ path: f.path, code: f.code })),
      });
    }

    return res.json({
      success: true,
      allPassed: evalResult.allPassed,
      score: evalResult.score,
      xpEarned: evalResult.allPassed ? challenge.xp : 0,
      passedCount: evalResult.passedCount,
      totalCount: evalResult.totalCount,
      results: evalResult.results,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

