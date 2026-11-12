import {
  registerUser,
  loginUser,
  COOKIE_NAME,
  getCookieOptions,
} from '../services/authService.js';

/**
 * POST /api/auth/register
 * Creates a new user in MongoDB, signs a JWT session, sets HttpOnly cookie
 */
export async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    const { user, token } = await registerUser({ name, email, password });

    // Set secure HttpOnly session cookie
    res.cookie(COOKIE_NAME, token, getCookieOptions());

    return res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user,
    });
  } catch (err) {
    console.error('[Auth Register Error]:', err.message);

    // MongoDB duplicate key error
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'An account with this email address already exists. Please sign in.',
      });
    }

    // Mongoose schema validation error
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        error: messages.join(', '),
      });
    }

    const isValidationErr =
      err.message.includes('valid') ||
      err.message.includes('required') ||
      err.message.includes('exists') ||
      err.message.includes('characters');

    return res.status(isValidationErr ? 400 : 500).json({
      success: false,
      error: err.message || 'Registration failed.',
    });
  }
}

/**
 * POST /api/auth/login
 * Validates credentials against MongoDB, signs a JWT session, sets HttpOnly cookie
 */
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    const { user, token } = await loginUser({ email, password });

    // Set secure HttpOnly session cookie
    res.cookie(COOKIE_NAME, token, getCookieOptions());

    return res.status(200).json({
      success: true,
      message: 'Signed in successfully',
      token,
      user,
    });
  } catch (err) {
    console.error('[Auth Login Error]:', err.message);

    const isAuthErr =
      err.message.includes('Invalid') ||
      err.message.includes('required') ||
      err.message.includes('not found');

    return res.status(isAuthErr ? 401 : 500).json({
      success: false,
      error: err.message || 'Authentication failed.',
    });
  }
}

/**
 * GET /api/auth/me
 * Returns authenticated user object from active session
 */
export async function getMe(req, res) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Not authenticated',
    });
  }

  return res.status(200).json({
    success: true,
    user: req.user,
  });
}

/**
 * POST /api/auth/logout
 * Clears authentication session cookie
 */
export async function logout(req, res) {
  try {
    res.clearCookie(COOKIE_NAME, {
      ...getCookieOptions(),
      maxAge: 0,
    });

    return res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Logout failed: ' + err.message,
    });
  }
}
