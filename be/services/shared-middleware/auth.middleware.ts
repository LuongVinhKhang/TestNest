import jwt from 'jsonwebtoken';
import User from '@identity/models/dtos/userDto';
import { Request, Response, NextFunction } from 'express';

const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';

export const generateToken = (user: User): string => {
  const payload = { id: user.id, email: user.email };
  return jwt.sign(payload, SECRET_KEY, { expiresIn: '60m' });
};

export interface AuthRequest extends Request {
  user?: User;
}

export const verifyToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    res.status(401).json({ message: 'Access denied' });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, SECRET_KEY) as User;
    req.user = decoded;
    next();
  } catch {
    console.log('Token verification failed');
    res.status(403).json({ message: 'Invalid token', success: false });
  }
};

export const refreshExpiredToken = (expiredToken: string): string | null => {
  try {
    // Verify the token even if expired
    const decoded = jwt.verify(expiredToken, SECRET_KEY, {
      ignoreExpiration: true,
    }) as User;
    // Generate new token with fresh expiration
    return generateToken(decoded);
  } catch {
    return null;
  }
};
