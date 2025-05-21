const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  // Get token from header
  try {
    const authHeader = req.header('Authorization');
    
    // Debug info
    console.log('Authorization header:', authHeader);
    
    // Extract token with more defensive coding
    let token = null;
    
    if (authHeader) {
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7).trim();
      } else {
        // In case the Bearer prefix is missing but token is still provided
        token = authHeader.trim();
      }
    } else {
      // Fallback to x-auth-token header
      token = req.header('x-auth-token');
    }
    
    console.log('Extracted token:', token ? `${token.substring(0, 15)}...` : 'none');
    
    // Check if no token
    if (!token) {
      console.log('No token found in request');
      return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // Verify token
    // Make sure JWT_SECRET is set
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not defined in environment variables');
      return res.status(500).json({ msg: 'Server configuration error' });
    }
    
    console.log('JWT_SECRET available, verifying token...');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token verified successfully');
    req.user = decoded.user;
    next();
  } catch (err) {
    console.error('Token verification error details:', err);
    if (err.name === 'JsonWebTokenError') {
      if (err.message === 'jwt malformed') {
        console.error('Token is malformed - check the format and encoding');
      } else if (err.message === 'invalid signature') {
        console.error('Token signature verification failed - check JWT_SECRET');
      }
    }
    return res.status(401).json({ msg: 'Token is not valid', error: err.message });
  }
};