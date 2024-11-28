import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

class SampleController {
  // Example: User registration
  async registerUser(req: Request, res: Response) {
    const { email, password, name, role } = req.body;

    try {
      // 1. Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // 2. Create the user in the database
      const user = await prisma.user.create({
        data: { email, password: hashedPassword, name, role },
      });

      // 3. Generate JWT (if needed)
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!);

      res.status(201).json({ user, token });
    } catch (error: any) {
      console.error(error);

      // Check for unique constraint violation
      if (error.code === 'P2002') {
        if (error.meta?.target?.includes('email')) {
          return res.status(400).json({ error: 'Email already exists' });
        }
        // Add other unique field checks if needed (e.g., username)
      }

      res.status(500).json({ error: 'Failed to register user' });
    }
  }

  // Example: User login
  async loginUser(req: Request, res: Response) {
    const { email, password } = req.body;

    try {
      // 1. Find the user in the database
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // 2. Compare passwords
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // 3. Generate JWT
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!);

      res.json({ user, token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to login' });
    }
  }
  // ... other controller methods ...
}

export default new SampleController();