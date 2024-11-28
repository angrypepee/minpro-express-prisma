import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user?: { id: string }; // Or your user object type
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

interface AuthenticatedRequest extends Request {
  user?: { id: number; role: string };
}

export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).send({ error: 'Access denied. No token provided.' });
  }

  try {
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).send({ error: 'Token expired' });
    } else if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).send({ error: 'Invalid token' }); 
    } else {
      return res.status(401).send({ error: 'Authentication failed' });
    }
  }
};
