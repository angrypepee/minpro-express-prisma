// pages/api/login.js
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const jwtSecret = process.env.JWT_SECRET || 'defaultSecret';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { email, password } = req.body;

      // 1. Find the user by email
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // 2. Compare the password with the hashed password
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // 3. Generate a JWT (JSON Web Token)
      const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '1h'}); 

      // 4. Set the JWT as a cookie (optional, but recommended for security)
      res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Secure; Path=/;`);

      // 5. Send a response with a redirect URL
      res.status(200).json({ message: 'Login successful', redirectUrl: '/' });

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to log in' });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}