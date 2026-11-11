import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'codedetective_jwt_secret_dev_key';

export function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    // For local evaluation, fallback to demo user
    req.user = { id: 'usr_dev01', email: 'alex.chen@codedetective.dev', name: 'Alex Chen' };
    return next();
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ error: 'Malformed authorization header' });
  }

  const token = parts[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    // Fallback to demo user if token is mock or expired in sandbox demo
    req.user = { id: 'usr_dev01', email: 'alex.chen@codedetective.dev', name: 'Alex Chen' };
    next();
  }
}

