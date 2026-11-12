import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { isDbConnected, ensureDbConnected } from '../config/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'codedetective_super_secret_jwt_key_2026';
export const COOKIE_NAME = 'cd_session';

/**
 * Returns cookie configuration matching environment security standards
 */
export function getCookieOptions() {
  const isProduction = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
  };
}

/**
 * Generates signed JWT payload containing minimal identity claims
 */
export function generateToken(user) {
  const payload = {
    id: user._id ? user._id.toString() : user.id,
    email: user.email,
    role: user.role || 'Developer',
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '7d',
  });
}

/**
 * Verifies JWT token string and returns decoded payload
 */
export function verifyTokenString(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

/**
 * Registers a new user account in MongoDB
 */
export async function registerUser({ name, email, password }) {
  if (!name || typeof name !== 'string' || !name.trim()) {
    throw new Error('Please enter your full name or handle.');
  }

  if (!email || typeof email !== 'string' || !email.trim()) {
    throw new Error('Please enter a valid email address.');
  }

  const normalizedEmail = email.trim().toLowerCase();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(normalizedEmail)) {
    throw new Error('Please provide a valid email address format.');
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    throw new Error('Password must be at least 6 characters long.');
  }

  // Ensure DB connection is active, waiting if handshaking
  await ensureDbConnected();

  if (!isDbConnected()) {
    throw new Error('Database is currently connecting to MongoDB. Please try again in a moment.');
  }

  const existing = await User.findOne({ email: normalizedEmail });
  if (existing) {
    throw new Error('An account with this email address already exists. Please sign in instead.');
  }

  const newUser = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password, // Handled by pre-save hook
    role: 'Developer',
    totalXP: 0,
    xp: 0,
    level: 1,
    currentStreak: 1,
    streak: 1,
    longestStreak: 1,
    solvedChallenges: [],
    completedChallenges: [],
    accuracy: 100,
  });

  const token = generateToken(newUser);
  return {
    user: newUser.toSafeObject(),
    token,
  };
}

/**
 * Authenticates user credentials against MongoDB
 */
export async function loginUser({ email, password }) {
  if (!email || !password) {
    throw new Error('Email and password are required.');
  }

  const normalizedEmail = email.trim().toLowerCase();

  await ensureDbConnected();

  if (!isDbConnected()) {
    throw new Error('Database is currently connecting to MongoDB. Please try again in a moment.');
  }

  const user = await User.findOne({ email: normalizedEmail }).select('+password');
  if (!user) {
    throw new Error('Invalid email or password.');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new Error('Invalid email or password.');
  }

  const token = generateToken(user);
  return {
    user: user.toSafeObject(),
    token,
  };
}

/**
 * Retrieves safe user representation by ID
 */
export async function getUserById(userId) {
  if (!userId) return null;

  await ensureDbConnected();
  if (!isDbConnected()) {
    return null;
  }

  const user = await User.findById(userId);
  if (!user) return null;

  return user.toSafeObject();
}
