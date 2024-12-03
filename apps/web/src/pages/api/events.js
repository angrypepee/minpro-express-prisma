// pages/api/events.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Fetch all events
      const events = await prisma.event.findMany({
        include: { user: true }, // Include user data if needed
      });

      res.status(200).json(events);
    } catch (error) {
      console.error('Error fetching events:', error);
      res.status(500).json({ error: 'Failed to fetch events' });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
