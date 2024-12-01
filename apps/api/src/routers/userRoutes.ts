import express, { Request, Response, NextFunction } from 'express';
import prisma from '../../prisma/client'; 
import { authMiddleware, AuthenticatedRequest } from '../../middleware/authmiddleware';

const router = express.Router();

// Protected route that requires authentication
router.post('/events', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
   try {
    // Check if req.user exists before accessing its properties
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' }); 
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
  

export default router;
