// pages/api/login.js
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

const NODE_ENV = process.env.NODE_ENV || 'development';
const envFile = NODE_ENV === 'development' ? '.env.development' : '.env';

dotenv.config({ path: resolve(__dirname, `../../${envFile}`) }); 

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET_KEY; 

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { email, password } = req.body;

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const token = jwt.sign({ userId: user.id }, JWT_SECRET); 

      res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Secure; Path=/;`);

      res.status(200).json({ message: 'Login successful' });

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to log in' });
    }
  } else {
    res.status(405).end(); 
  }
}