// pages/api/logout.js
export default function handler(req, res) {
    if (req.method === 'POST') {
      try {
        // Set the cookie expiration to the past, effectively logging out the user
        res.setHeader('Set-Cookie', 'token=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict;');
        
        // Return a successful logout response
        res.status(200).json({ message: 'Logged out successfully' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to log out' });
      }
    } else {
      res.status(405).end(); // Method Not Allowed
    }
  }
  