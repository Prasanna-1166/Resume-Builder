import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: string;
  name?: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

function extractToken(req: Request): string | null {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7).trim();
  }
  if (req.cookies?.user_token) {
    return req.cookies.user_token;
  }
  if (req.cookies?.admin_token) {
    return req.cookies.admin_token;
  }
  return null;
}

/**
 * Standard user authentication guard: permits both normal USERs and ADMINs.
 */
export function requireUserAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const token = extractToken(req);

  if (!token) {
    res.status(401).json({ error: 'Authentication required. Please log in to continue.' });
    return;
  }

  const jwtSecret = process.env.JWT_SECRET || 'dev_secret_key_12345';

  try {
    const decoded = jwt.verify(token, jwtSecret) as AuthenticatedUser;
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired session token.' });
  }
}

/**
 * Optional authentication middleware for guest/authenticated endpoints (e.g. feedback submission).
 */
export function optionalAuth(req: AuthenticatedRequest, _res: Response, next: NextFunction): void {
  const token = extractToken(req);
  if (!token) {
    return next();
  }

  const jwtSecret = process.env.JWT_SECRET || 'dev_secret_key_12345';
  try {
    const decoded = jwt.verify(token, jwtSecret) as AuthenticatedUser;
    req.user = decoded;
  } catch {
    // Non-fatal for optional auth
  }
  next();
}

/**
 * Admin-only authentication guard. Ensures caller is authenticated and has ADMIN or SUPER_ADMIN role.
 */
export function authGuard(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const token = req.cookies?.admin_token || extractToken(req);

  if (!token) {
    res.status(401).json({ error: 'Unauthorized. Admin authentication required.' });
    return;
  }

  const jwtSecret = process.env.JWT_SECRET || 'dev_secret_key_12345';

  try {
    const decoded = jwt.verify(token, jwtSecret) as AuthenticatedUser;
    req.user = decoded;

    if (decoded.role && decoded.role !== 'ADMIN' && decoded.role !== 'SUPER_ADMIN') {
      res.status(403).json({ error: 'Forbidden. Admin privileges required.' });
      return;
    }

    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired session token.' });
  }
}

/**
 * Explicit admin role checker following user authentication.
 */
export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  if (!req.user || (req.user.role !== 'ADMIN' && req.user.role !== 'SUPER_ADMIN')) {
    res.status(403).json({ error: 'Forbidden. Admin privileges required.' });
    return;
  }
  next();
}
