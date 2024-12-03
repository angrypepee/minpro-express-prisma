import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const jwtSecret = process.env.JWT_SECRET || 'defaultSecret';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const token = req.cookies.token; // Get the JWT token from the cookie
      if (!token) {
        return res.status(401).json({ error: 'Unauthorized, no token found' });
      }

      // Verify the token
      const decoded = jwt.verify(token, jwtSecret);
      const userId = decoded.userId;

      // Find the user in the database
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.status(200).json(user); // Send the user data in the response
    } catch (error) {
      console.error('Error fetching profile:', error); // Log the error to the console
      res.status(500).json({ error: `Failed to fetch profile: ${error.message}` });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
