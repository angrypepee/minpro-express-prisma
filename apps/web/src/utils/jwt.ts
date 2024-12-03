// utils/jwt.ts
import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET || 'defaultSecret';

/**
 * Helper function to verify JWT token and decode the payload.
 * @param {string} token - The JWT token to verify.
 * @returns {object} - The decoded JWT payload (asserted as DecodedToken).
 * @throws Will throw an error if the token is invalid.
 */
export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, jwtSecret); // jwt.verify returns the decoded payload
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};
