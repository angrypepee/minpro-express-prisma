import { Request, Response } from 'express';
import prisma from '@/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export class AuthController {
  // Register a new user
  async register(req: Request, res: Response) {
    const { email, password, name, role } = req.body;

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await prisma.user.create({
        data: { email, password: hashedPassword, name, role },
      });

      res.status(201).send({ message: 'User registered successfully', user: newUser });
    } catch (error) {
      if (error.code === 'P2002') {
        return res.status(400).send({ error: 'Email already exists' });
      }
      res.status(500).send({ error: 'Error registering user' });
    }
  }

  // Login a user
  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    try {
      const user = await prisma.user.findUnique({ where: { email } });

      if (!user) {
        return res.status(401).send({ error: 'Invalid email or password' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).send({ error: 'Invalid email or password' });
      }

      const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });

      res.send({ message: 'Login successful', token });
    } catch (error) {
      res.status(500).send({ error: 'Error logging in user' });
    }
  }

  // Get authenticated user's data
  async getAuthenticatedUser(req: Request, res: Response) {
    const userId = req.user?.id;

    try {
      const user = await prisma.user.findUnique({ where: { id: userId } });

      if (!user) {
        return res.status(404).send({ error: 'User not found' });
      }

      res.send({ user });
    } catch (error) {
      res.status(500).send({ error: 'Error fetching user data' });
    }
  }
}
