import { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from '../../utils/jwt'; 

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(400).json({ error: 'Token not provided' });
  }

  try {
    const decoded = verifyToken(token); 
    return res.status(200).json({ decoded }); 
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}
