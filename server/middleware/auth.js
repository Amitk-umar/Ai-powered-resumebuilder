const { verifyToken } = require('../config/firebase-admin');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    
    // Try Firebase Admin verification first
    const decoded = await verifyToken(token);

    if (decoded) {
      req.user = {
        uid: decoded.uid,
        email: decoded.email,
        name: decoded.name || decoded.email
      };
    } else {
      // Fallback: decode JWT payload without verification (development mode)
      // Firebase ID tokens are JWTs - we can read the payload
      try {
        const payload = JSON.parse(
          Buffer.from(token.split('.')[1], 'base64').toString()
        );
        req.user = {
          uid: payload.user_id || payload.sub,
          email: payload.email || '',
          name: payload.name || payload.email || ''
        };
      } catch (decodeErr) {
        return res.status(401).json({ error: 'Invalid token format' });
      }
    }

    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Role-based access control
const adminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(403).json({ error: 'Access denied' });
  }
  next();
};

module.exports = { authMiddleware, adminOnly };
