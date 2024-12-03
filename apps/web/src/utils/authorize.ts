// utils/authorize.js
const { verifyToken } = require('./jwt'); 
import { NextApiRequest, NextApiResponse } from 'next';

const authorize = (req: NextApiRequest, res: NextApiResponse, next: Function) => {
  const token = req.headers['authorization']?.split(' ')[1];  // Extract token from Authorization header
  if (!token) {
    return res.status(401).json({ error: 'Authorization token is required' });
  }

  try {
    const decoded = verifyToken(token);  // Verify token using the verifyToken function
    req.user = decoded;  // Attach the decoded token to the request object
    next();  // Call the next handler (continue the request flow)
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

export default authorize;