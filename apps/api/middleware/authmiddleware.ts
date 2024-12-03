// middleware/authmiddleware.ts
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface AuthenticatedRequest extends Request {
  user?: { id: number; role: string };
}

// Get the JWT secret key from environment variables
const jwtSecretKey = process.env.JWT_SECRET_KEY || 'FTz5pxy61cdaWyejfKPdNZAYItLGoErRaHPqrBoGfWw=';

export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res
        .status(401)
        .json({ message: 'Authorization header missing' });
    }

    // Use the jwtSecretKey to verify the token
    const decodedToken = jwt.verify(token, jwtSecretKey) as {
      userId: number;
    };

    const user = await prisma.user.findUnique({
      where: { id: decodedToken.userId },
      select: { id: true, role: true },
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Invalid token' });
  }
};