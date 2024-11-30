// authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

import { AuthenticatedRequest } from '../src/types';


const prisma = new PrismaClient();

const jwtSecretKey = process.env.JWT_SECRET_KEY || 'your-default-secret'; 
// Middleware
export const authMiddleware = async (
  req: Request, 
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Authorization header missing' });
    }

    const jwtSecretKey = process.env.JWT_SECRET_KEY || 'your-default-secret';
    const decodedToken = jwt.verify(token, jwtSecretKey) as { userId: number };

    const user = await prisma.user.findUnique({
      where: { id: decodedToken.userId },
      select: { id: true, role: true },
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    // Explicitly cast req as AuthenticatedRequest here
    (req as AuthenticatedRequest).user = user;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Invalid token' });
  }
};
