import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { isDbConnected } from '../config/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'codedetective_jwt_secret_dev_key';

// In-Memory store fallback
const memoryUsers = new Map();

export async function register(req, res) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields (name, email, password) are required.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    if (isDbConnected()) {
      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(400).json({ error: 'Email already registered.' });
      }

      const newUser = await User.create({
        name,
        email,
        passwordHash,
        xp: 100,
        level: 1,
        streak: 1,
        accuracy: 100,
        solvedCount: 0,
      });

      const token = jwt.sign({ id: newUser._id, email: newUser.email }, JWT_SECRET, {
        expiresIn: '7d',
      });

      return res.status(201).json({
        success: true,
        token,
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          avatar: newUser.avatar,
          xp: newUser.xp,
          level: newUser.level,
          streak: newUser.streak,
          accuracy: newUser.accuracy,
          solvedCount: newUser.solvedCount,
          completedChallenges: newUser.completedChallenges,
        },
      });
    }

    // Fallback in-memory
    const memUser = {
      id: `usr_${Date.now()}`,
      name,
      email,
      passwordHash,
      role: 'Full Stack Engineer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      xp: 100,
      level: 1,
      streak: 1,
      accuracy: 100,
      solvedCount: 0,
      completedChallenges: [],
    };
    memoryUsers.set(email, memUser);

    const token = jwt.sign({ id: memUser.id, email: memUser.email }, JWT_SECRET, {
      expiresIn: '7d',
    });

    return res.status(201).json({ success: true, token, user: memUser });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required.' });
    }

    if (isDbConnected()) {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password.' });
      }

      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid email or password.' });
      }

      const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
        expiresIn: '7d',
      });

      return res.json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          xp: user.xp,
          level: user.level,
          streak: user.streak,
          accuracy: user.accuracy,
          solvedCount: user.solvedCount,
          completedChallenges: user.completedChallenges,
        },
      });
    }

    // Fallback demo user
    const demoUser = {
      id: 'usr_dev01',
      name: email.split('@')[0] || 'Alex Chen',
      email,
      role: 'Full Stack Engineer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      xp: 1420,
      level: 4,
      streak: 7,
      accuracy: 92,
      solvedCount: 16,
      completedChallenges: ['ch_auth_01', 'ch_react_01'],
    };

    const token = jwt.sign({ id: demoUser.id, email: demoUser.email }, JWT_SECRET, {
      expiresIn: '7d',
    });

    return res.json({ success: true, token, user: demoUser });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export async function getProfile(req, res) {
  return res.json({ success: true, user: req.user });
}

