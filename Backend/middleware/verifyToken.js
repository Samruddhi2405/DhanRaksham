const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  console.log('Inside verifyToken!');
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded payload:', decoded);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('JWT verification failed:', err);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = verifyToken;
