// pages/api/other.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Replace `otherData` with the appropriate model or query
      const otherData = await prisma.otherData.findMany(); // Adjust to your data model

      res.status(200).json(otherData);
    } catch (error) {
      console.error('Error fetching other data:', error);
      res.status(500).json({ error: 'Failed to fetch other data' });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
