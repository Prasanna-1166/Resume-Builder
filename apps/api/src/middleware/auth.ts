import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export function authGuard(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const token = req.cookies?.admin_token || req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    res.status(401).json({ error: 'Unauthorized. Admin authentication required.' });
    return;
  }

  const jwtSecret = process.env.JWT_SECRET || 'dev_secret_key_12345';

  try {
    const decoded = jwt.verify(token, jwtSecret) as { id: string; email: string; role: string };
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired session token.' });
  }
}
