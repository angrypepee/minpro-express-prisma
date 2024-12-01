// auth.controller.ts
import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

const NODE_ENV = process.env.NODE_ENV || 'development';
const envFile = NODE_ENV === 'development' ? '.env.development' : '.env';
dotenv.config({ path: resolve(__dirname, `../${envFile}`) });
dotenv.config({ path: resolve(__dirname, `../${envFile}.local`), override: true });

const JWT_SECRET = process.env.JWT_SECRET_KEY as string;

export class AuthController {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  public async register(req: Request, res: Response): Promise<Response> {
    try {
      const { name, email, password, role } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({ message: 'Please provide name, email, and password' });
      }

      const existingUser = await this.prisma.user.findUnique({
        where: { email },
      });
      if (existingUser) {
        return res.status(409).json({ message: 'User already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await this.prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: role || 'ATTENDEE',
        },
      });

      return res.status(201).json({ message: 'User created successfully', user });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Something went wrong' });
    }
  }

  public async login(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: 'Please provide email and password' });
      }

      const user = await this.prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { algorithm: 'HS256' });

      res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Secure; Path=/;`);
      return res.status(200).json({ message: 'Login successful' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Something went wrong' });
    }
  }

  public async getAuthenticatedUser(req: any, res: Response): Promise<Response> {
    try {
      const user = req.user;

      if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      return res.status(200).json({ user });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Something went wrong' });
    }
  }
}