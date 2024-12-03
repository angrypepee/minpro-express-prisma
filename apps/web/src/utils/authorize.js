import { verify } from 'jsonwebtoken';

export function authorize(req, res, allowedRoles = []) {
  const token = req.cookies.token; // Adjust for cookie handling based on your framework

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decoded = verify(token, process.env.JWT_SECRET_KEY);
    if (allowedRoles.length > 0 && !allowedRoles.includes(decoded.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    req.user = decoded; // Attach user info to the request object
    return true;
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}
