const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer token

  if (!token) return res.sendStatus(401); // Unauthorized

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // Forbidden
    req.user = user;
    req.token = token;
    next();
  });
};

// isAdmin middleware must be called always after authenticateToken middleware
const isAdmin = async (req, res, next) => {
  const user = req.user;

  try {
    if (!user) return res.sendStatus(401); // Unauthorized

    if (!user.roles.includes('ADMIN')) {
      res.sendStatus(403).send('Admin Access Required');
    }

    next();
  } catch (err) {
    console.error(err);
    res.status(400).send('An Unknown Error Occured');
  }
};

// TODO: Add hasRole middleware to check custom roles
// Middleware to check if user is authenticated and has required role

// hasRole middleware must be called always after authenticateToken middleware
const hasRole = (roles) => async (req, res, next) => {
  const user = req.user;

  try {
    const hasRequiredRole = roles.some((role) => user.roles.includes(role));

    if (!hasRequiredRole) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = { authenticateToken, isAdmin, hasRole };
