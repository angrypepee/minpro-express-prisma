// routers/index.ts
import { Request, Response, Router } from 'express';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { authMiddleware } from 'middleware/authmiddleware';
import * as jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const router = Router();

const jwtSecretKey = process.env.JWT_SECRET_KEY || 'j1J1VEgOQjl1NtmZftCA8YOxQOHjKRXM6MoNPvPb29s=';

interface AuthenticatedRequest extends Request {
  user: { id: number; role: string; password?: string };
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

const authController = new AuthController();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/user', authMiddleware, authController.getAuthenticatedUser);

// --- Event Routes ---

router.post('/events', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id: organizerId } = req.user;
    const { name, date, location, description, limit, image } = req.body;

    const event = await prisma.event.create({
      data: { name, date: new Date(date), location, description, limit, image, organizerId, createdAt: new Date() },
    });

    return res.status(201).json({ message: 'Event created successfully', event });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to create event' });
  }
});

router.get('/events', async (_req, res) => {
  try {
    const events = await prisma.event.findMany({ include: { organizer: true } });
    return res.json(events);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to fetch events' });
  }
});

router.get('/events/:id', async (req, res) => {
  try {
    const eventId = parseInt(req.params.id, 10);
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { organizer: true },
    });

    if (!event) return res.status(404).json({ error: 'Event not found' });
    return res.json(event);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to fetch event' });
  }
});

router.put('/events/:id', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const eventId = parseInt(req.params.id, 10);
    const { name, date, location, description, limit, image } = req.body;

    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data: { name, date: new Date(date), location, description, limit, image },
    });

    return res.json(updatedEvent);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to update event' });
  }
});

router.delete('/events/:id', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const eventId = parseInt(req.params.id, 10);
    await prisma.event.delete({ where: { id: eventId } });

    return res.status(204).end();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to delete event' });
  }
});

export default router;
