// utils/jwt.js
const jwt = require('jsonwebtoken');

const secretKey = process.env.JWT_SECRET_KEY || 'FTz5pxy61cdaWyejfKPdNZAYItLGoErRaHPqrBoGfWw='; // Use a secret key from your environment

function signToken(payload) {
  return jwt.sign(payload, secretKey, { expiresIn: '1h' });  // Set expiry time as 1 hour
}

function verifyToken(token) {
  try {
    return jwt.verify(token, secretKey);  // Return the decoded token
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}

module.exports = { signToken, verifyToken };
