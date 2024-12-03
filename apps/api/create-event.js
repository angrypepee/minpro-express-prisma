import { PrismaClient } from '@prisma/client';
import { verifyToken } from '../../utils/jwt'; // Adjust the path if needed

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { name, description, limit, date, location, ticketType, price } = req.body;

      if (!name || !description || !limit || !date || !location || !ticketType || price === undefined) {
        return res.status(400).json({ error: 'All fields are required' });
      }

      const token = req.cookies.token|| req.headers.authorization?.split(' ')[1];
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

      // Create the event in the database
      const event = await prisma.event.create({
        data: {
          name,
          description,
          limit,
          date: new Date(date), // Convert the date string to Date object
          location,
          organizerId: userId,
        },
      });

      // Create the ticket for the event
      const ticket = await prisma.ticket.create({
        data: {
          eventId: event.id,
          type: ticketType,
          price: parseFloat(price),
        },
      });

      // Return the created event and ticket in the response
      res.status(200).json({ event, ticket });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to create event' });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
