import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Extract the token from the 'Authorization' header
      const token = req.headers.authorization?.split(' ')[1]; // Get token after 'Bearer'

      if (!token) {
        return res.status(401).json({ error: 'No token provided' });
      }

      // Verify the token
      const decoded = jwt.verify(token, 'j1J1VEgOQjl1NtmZftCA8YOxQOHjKRXM6MoNPvPb29s= '); // Your secret key

      // Log decoded token for debugging
      console.log('Decoded token:', decoded);

      // Fetch the user from the database using userId from the decoded token
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Return the user data
      res.status(200).json(user);
    } catch (error) {
      console.error('Error verifying token or fetching user:', error);
      res.status(401).json({ error: 'Unauthorized or invalid token' });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
