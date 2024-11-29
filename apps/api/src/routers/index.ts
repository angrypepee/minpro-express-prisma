import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

class AuthController {
  // ... other controller methods (login, getAuthenticatedUser)

  public async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, name, password, role } = req.body;

      // Important: Hash the password here before storing it!
      const hashedPassword = await bcrypt.hash(password, 10); // Use bcrypt or a similar library

      const newUser = await prisma.user.create({
        data: {
          email,
          name,
          password: hashedPassword, 
          role: role || 'ATTENDEE', // Set default role if not provided
        },
      });

      res.status(201).json(newUser);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to create user' });
    }
  }
}

export { AuthController };