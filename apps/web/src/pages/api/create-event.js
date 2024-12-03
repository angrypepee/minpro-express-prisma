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

      // Verify the JWT token and extract user info
      let decoded;
      try {
        decoded = verifyToken(token);
      } catch (error) {
        return res.status(401).json({ error: 'Invalid or expired token' });
      }
      
      // Define userId from decoded token
      const userId = decoded.userId;

      // Fetch the user to check if the user is an organizer
      const user = await prisma.user.findUnique({ where: { id: Number(userId) } });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      if (user.role !== 'ORGANIZER') {
        return res.status(403).json({ error: 'Only organizers can create events' });
      }

       // Ensure the date is parsed correctly
       const eventDate = new Date(date);

       if (isNaN(eventDate.getTime())) {
         return res.status(400).json({ error: 'Invalid date format' });
       }
 
      // Create the event in the database
      const event = await prisma.event.create({
        data: {
          name,
          description,
          limit,
          date: eventDate,
          location,
          image: "image-url-or-path", // Use actual image URL if available
          organizerId: Number(userId),
          createAt: new Date(),
          tickets: {
            create: [
              {
                type: ticketType,
                price: parseFloat(price),
              },
            ],
          },
        },
      });

      res.status(200).json(event); // Return the created event

    } catch (error) {
      console.error('Error creating event:', error);
      res.status(500).json({ error: 'Failed to create event' });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}

