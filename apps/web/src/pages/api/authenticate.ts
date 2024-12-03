// pages/api/authenticate.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { signToken } from '../../utils/jwt';  

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        // In a real app, you would authenticate the user based on username/password or other credentials.
        const user = {
        userId: '123', 
        role: 'ORGANIZER', 
        };

        const token = signToken(user);  // Generate the token
        return res.status(200).json({ token });  // Return the generated token
    }

  res.status(405).end();  // Method Not Allowed
}
