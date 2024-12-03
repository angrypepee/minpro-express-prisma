// pages/api/create-event.ts
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '../../utils/jwt'; // Helper function to verify JWT
import { NextApiRequest, NextApiResponse } from 'next'; // Import Next.js types

const prisma = new PrismaClient();

interface DecodedToken {
  userId: string;
  exp: number; // Include any other JWT claims you may have
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { name, description, limit, date, location, ticketType, price } = req.body;
      const token = req.cookies.token;

      // Check if the token exists
      if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Verify the JWT token
      let decoded: DecodedToken;
      try {
        decoded = verifyToken(token) as DecodedToken; // Cast the decoded token to DecodedToken type
      } catch (error) {
        return res.status(401).json({ error: 'Invalid or expired token' });
      }

      const userId = decoded.userId;

      // Fetch the user to check if the user is an organizer
      const user = await prisma.user.findUnique({ where: { id:Number(userId) } });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      if (user.role !== 'ORGANIZER') {
        return res.status(403).json({ error: 'Only organizers can create events' });
      }

      // Ensure the date is parsed correctly
      const eventDate = new Date(date); // Make sure 'date' is in the correct format

      if (isNaN(eventDate.getTime())) {
        return res.status(400).json({ error: 'Invalid date format' });
      }

      // Create the event
      const event = await prisma.event.create({
        data: {
          name,
          description,
          limit,
          date: eventDate, // Ensure the date is a valid Date object
          location,
          organizerId: Number(userId), // Set the user who is organizing the event
          createAt: new Date(), // Set creation date to now
          tickets: {
            create: [
              {
                type: ticketType,
                price: parseFloat(price), // Ensure price is a float
              },
            ],
          },
        },
      });

      // Send the created event as a response
      res.status(200).json(event);
    } catch (error) {
      console.error('Error creating event:', error);
      res.status(500).json({ error: error.message || 'Failed to create event' });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
