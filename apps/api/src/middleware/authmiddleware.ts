// middleware/authmiddleware.ts
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client'; 

const prisma = new PrismaClient(); 

interface AuthenticatedRequest extends Request {
  user?: { id: string; role: string };
}

export const authMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; 

    if (!token) {
      return res.status(401).json({ message: 'Authorization header missing' });
    }

    const decodedToken = jwt.verify(token, 'your-secret-key') as { userId: string }; 

    const user = await prisma.user.findUnique({  
      where: { id: parseInt(decodedToken.userId) },
      select: { id: true, role: true } 
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = { id: user.id.toString(), role: user.role }; 
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Invalid token' });
  }
};