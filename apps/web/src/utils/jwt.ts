// utils/jwt.ts
import jwt from 'jsonwebtoken';

const secretKey = process.env.JWT_SECRET_KEY || 'FTz5pxy61cdaWyejfKPdNZAYItLGoErRaHPqrBoGfWw='; // Use a secret key from your environment

// Define the DecodedToken interface to match the structure of the decoded token
interface DecodedToken {
  userId: string;
  exp: number;  // Expiration timestamp of the token
}

export function signToken(payload: { userId: string }) {
  return jwt.sign(payload, secretKey, { expiresIn: '1h' });  // Set expiry time as 1 hour
}

export function verifyToken(token: string): DecodedToken {
  try {
    return jwt.verify(token, secretKey) as DecodedToken;  // Return the decoded token with the userId and expiration
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}
