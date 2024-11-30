// routers/index.ts
import { Request, Response, Router } from 'express';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { authMiddleware } from 'middleware/authmiddleware';
import * as jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const router = Router();

const jwtSecretKey = process.env.JWT_SECRET_KEY || 'j1J1VEgOQjl1NtmZftCA8YOxQOHjKRXM6MoNPvPb29s=';

export interface AuthenticatedRequest extends Request {
  user: {
    id: number;
    role: string;
    password?: string;
  };
}

// --- User Authentication Routes ---

class AuthController {
  async register(req: Request, res: Response): Promise<Response> {
    try {
      const { email, name, password, role } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await prisma.user.create({
        data: { email, name, password: hashedPassword, role: role || 'ATTENDEE' },
      });

      return res.status(201).json(newUser);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to create user' });
    }
  }

  async login(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = req.body;

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const token = jwt.sign({ userId: user.id, role: user.role }, jwtSecretKey);
      res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Secure; Path=/;`);
      return res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to log in' });
    }
  }

  async getAuthenticatedUser(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const user = req.user;
      if (!user) return res.status(401).json({ error: 'Unauthorized' });

      const { password, ...userData } = user;
      return res.status(200).json(userData);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to get user' });
    }
  }
}

export default router;
