import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const SECRET_KEY = 'j1J1VEgOQjl1NtmZftCA8YOxQOHjKRXM6MoNPvPb29s='; // Use your actual secret key here

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const token = req.cookies.token; // Get the JWT token from the cookie
      if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Verify the token
      const decoded = jwt.verify(token, SECRET_KEY);
      const userId = decoded.userId;

      // Find the user in the database
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.status(200).json(user);
    } catch (error) {
      console.error('Error in profile API route:', error);
      res.status(500).json({ error: 'Failed to fetch profile' });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
