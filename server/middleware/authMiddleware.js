import { COOKIE_NAME, verifyTokenString } from '../services/authService.js';
import User from '../models/User.js';
import { isDbConnected } from '../config/db.js';

/**
 * Helper to extract token from request (cookies first, then Authorization header)
 */
export function extractToken(req) {
  // 1. Try parsed cookies
  if (req.cookies && req.cookies[COOKIE_NAME]) {
    return req.cookies[COOKIE_NAME];
  }
  if (req.cookies && req.cookies.token) {
    return req.cookies.token;
  }

  // 2. Try raw cookie header if req.cookies not yet populated
  if (req.headers.cookie) {
    const rawCookies = req.headers.cookie.split(';');
    for (const cookie of rawCookies) {
      const [name, ...rest] = cookie.trim().split('=');
      if (name === COOKIE_NAME || name === 'token') {
        return decodeURIComponent(rest.join('='));
      }
    }
  }

  // 3. Try Authorization Bearer header
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (authHeader && typeof authHeader === 'string') {
    const parts = authHeader.split(' ');
    if (parts.length === 2 && (parts[0] === 'Bearer' || parts[0] === 'bearer')) {
      return parts[1];
    }
  }

  return null;
}

/**
 * Strict authentication guard middleware
 * Rejects with 401 if unauthenticated or session invalid
 */
export async function verifyToken(req, res, next) {
  const token = extractToken(req);

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required. Please sign in to access this resource.',
    });
  }

  const decoded = verifyTokenString(token);
  if (!decoded || !decoded.id) {
    return res.status(401).json({
      success: false,
      error: 'Invalid or expired session. Please sign in again.',
    });
  }

  try {
    if (isDbConnected()) {
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'User account not found or removed.',
        });
      }
      req.user = user.toSafeObject();
    } else {
      // In case DB connection is momentarily disconnected, carry token claims
      req.user = {
        id: decoded.id,
        _id: decoded.id,
        email: decoded.email,
        role: decoded.role || 'Developer',
      };
    }

    req.token = token;
    next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Authentication verification failure: ' + err.message,
    });
  }
}

/**
 * Optional authentication: attaches user if valid token exists, doesn't block if absent
 */
export async function optionalAuth(req, res, next) {
  const token = extractToken(req);
  if (!token) {
    req.user = null;
    return next();
  }

  const decoded = verifyTokenString(token);
  if (!decoded || !decoded.id) {
    req.user = null;
    return next();
  }

  try {
    if (isDbConnected()) {
      const user = await User.findById(decoded.id);
      req.user = user ? user.toSafeObject() : null;
    } else {
      req.user = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
      };
    }
    next();
  } catch (e) {
    req.user = null;
    next();
  }
}
