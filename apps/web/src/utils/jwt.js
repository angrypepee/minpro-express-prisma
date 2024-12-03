// src/utils/jwt.js
import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET || 'defaultSecret';

/**
 * Helper function to verify JWT token and decode the payload.
 * @param {string} token - The JWT token to verify.
 * @returns {object} - The decoded JWT payload.
 * @throws Will throw an error if the token is invalid.
 */
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, jwtSecret);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};
