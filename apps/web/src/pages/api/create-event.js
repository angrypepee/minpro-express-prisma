import { PrismaClient } from '@prisma/client';
import { verifyToken } from '../../utils/jwt'; // Helper function to verify JWT

const prisma = new PrismaClient();

// /pages/api/create-event.js
export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { name, description, date, location, ticketType, price } = req.body;
      const token = req.cookies.token;

      if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const decoded = verifyToken(token);
      const userId = decoded.userId;

      // Check if the user is an organizer
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (user?.role !== 'ORGANIZER') {
        return res.status(403).json({ error: 'Only organizers can create events' });
      }

      // Create the event
      const event = await prisma.event.create({
        data: {
          name,
          description,
          limit,
          date: new Date(date), // Ensure the date is formatted correctly
          location,
          organizerId: userId,
        },
      });

      // Create ticket for the event
      if (ticketType && price) {
        await prisma.ticket.create({
          data: {
            eventId: event.id,
            type: ticketType,
            price: parseFloat(price),
          },
        });
      }

      res.status(200).json(event); // Return the created event

    } catch (error) {
      console.error("Error creating event:", error); // Log the error for debugging
      res.status(500).json({ error: 'Failed to create event' });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}

