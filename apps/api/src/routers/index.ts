// routers/index.ts
import { PrismaClient } from '@prisma/client';
import { Request, Response, Router } from 'express';
import { authMiddleware } from 'middleware/authmiddleware';
import { AuthenticatedRequest } from 'src/types';

import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';


const prisma = new PrismaClient();
const router = Router();

// Get the JWT secret key from environment variables
const jwtSecretKey = process.env.JWT_SECRET_KEY || 'j1J1VEgOQjl1NtmZftCA8YOxQOHjKRXM6MoNPvPb29s=';
if (!jwtSecretKey) {
  console.warn("Warning: JWT_SECRET_KEY is not set. Using a fallback key for development.");
}


// --- User Authentication Routes ---

//Registrasi User
class AuthController {
  public async register(req: Request, res: Response): Promise<Response> {
    try {
      const { email, name, password, role } = req.body;
      if (!email || !name || !password) {
        return res.status(400).json({ error: 'Email, name, and password are required' });
      }

      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(409).json({ error: 'Email is already registered' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await prisma.user.create({
        data: {
          email,
          name,
          password: hashedPassword,
          role: role || 'ATTENDEE',
        },
      });

      return res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
      console.error('Register Error:', error);
      return res.status(500).json({ error: 'Failed to create user' });
    }
  }

  //Login User
  public async login(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      //password tersimpan dalam waktu tertentu
      const token = jwt.sign({ userId: user.id }, jwtSecretKey, { expiresIn: '1d' });

      res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Secure; Path=/;`);
      return res.status(200).json({ message: 'Login successful' });
    } catch (error) {
      console.error('Login Error:', error);
      return res.status(500).json({ error: 'Failed to log in' });
    }
  }

  public async getAuthenticatedUser(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { password, ...userData } = req.user;
      return res.status(200).json(userData);
    } catch (error) {
      console.error('Get Authenticated User Error:', error);
      return res.status(500).json({ error: 'Failed to get user' });
    }
  }
}

const authController = new AuthController();

router.post('/register', authController.register.bind(authController));
router.post('/login', authController.login.bind(authController));
router.get('/user', authMiddleware, authController.getAuthenticatedUser.bind(authController));


// --- Event Routes ---

router.post('/events', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {

    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const organizerId = req.user.id;
    const { name, date, location, description, limit, image } = req.body;

    const event = await prisma.event.create({
      data: {
        name,
        date: new Date(date),
        location,
        description,
        limit,
        image,
        organizerId,
        createdAt: new Date(),
      },
    });

    res.status(201).json({ message: 'Event created successfully', event });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create event' });
  }
});

// GET /api/events
router.get('/events', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const events = await prisma.event.findMany({
      include: {
        organizer: true,
      },
    });
    res.json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// GET /api/events/:id
router.get('/events/:id', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const eventId = parseInt(req.params.id, 10);
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        organizer: true,
      },
    });

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch event' });
  }
});

// PUT /api/events/:id
router.put('/events/:id', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const eventId = parseInt(req.params.id, 10);
    const { name, date, location, description, limit, image } = req.body;

    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data: {
        name,
        date: new Date(date),
        location,
        description,
        limit,
        image,
      },
    });

    res.json(updatedEvent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update event' });
  }
});

// DELETE /api/events/:id
router.delete('/events/:id', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const eventId = parseInt(req.params.id, 10);

    await prisma.event.delete({
      where: { id: eventId },
    });

    res.status(204).end(); // No content
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

export default router;
