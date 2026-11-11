import User from '../models/User.js';
import Attempt from '../models/Attempt.js';
import { isDbConnected } from '../config/db.js';
import { SERVER_LEADERBOARD, SERVER_ATTEMPTS } from '../utils/seedData.js';

export async function getLeaderboard(req, res) {
  try {
    const { timeframe } = req.query;

    if (isDbConnected()) {
      const users = await User.find()
        .sort({ xp: -1 })
        .limit(20)
        .select('name avatar xp level streak accuracy solvedCount role');

      if (users && users.length > 0) {
        const ranked = users.map((u, i) => ({
          rank: i + 1,
          id: u._id,
          name: u.name,
          username: `@${u.name.toLowerCase().replace(/\s+/g, '_')}`,
          avatar: u.avatar,
          xp: u.xp,
          solved: u.solvedCount,
          accuracy: u.accuracy,
          streak: u.streak,
          badge: u.role || 'Detective',
        }));
        return res.json({ success: true, timeframe, data: ranked });
      }
    }

    // Default ranked seed data
    return res.json({ success: true, timeframe, data: SERVER_LEADERBOARD });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export async function getAttempts(req, res) {
  try {
    const userId = req.user?.id || 'usr_dev01';

    if (isDbConnected()) {
      const attempts = await Attempt.find({ userId }).sort({ createdAt: -1 });
      if (attempts && attempts.length > 0) {
        return res.json({ success: true, count: attempts.length, data: attempts });
      }
    }

    return res.json({ success: true, count: SERVER_ATTEMPTS.length, data: SERVER_ATTEMPTS });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

