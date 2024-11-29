// middleware/authmiddleware.ts
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client'; 

const prisma = new PrismaClient(); 

interface AuthenticatedRequest extends Request {
  user?: { id: number; role: string }; // Changed id to number
}

export const authMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; 

    if (!token) {
      return res.status(401).json({ message: 'Authorization header missing' });
    }

    const decodedToken = jwt.verify(token, 'i88HfEIrhmQxcKKToLlIGfxBg8KKA7YlRZxvxr433js= ') as { userId: number }; // Changed userId to number

    const user = await prisma.user.findUnique({  
      where: { id: decodedToken.userId }, 
      select: { id: true, role: true } 
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = user; // No need to convert id to string
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Invalid token' });
  }
};