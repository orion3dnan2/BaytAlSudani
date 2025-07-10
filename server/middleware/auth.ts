import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { storage } from '../storage';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    role: string;
    email: string;
    fullName: string;
  };
}

// Middleware to verify JWT token
export const authenticateToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; role: string };
    const user = await storage.getLegacyUser(decoded.userId);

    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = {
      id: user.id,
      role: user.role,
      email: user.email,
      fullName: user.fullName,
    };

    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

// Middleware to check if user has admin role
export const requireAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// Middleware to check if user has store owner role
export const requireStoreOwner = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'merchant' && req.user?.role !== 'store_owner' && req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Store owner access required' });
  }
  next();
};

// Middleware to check if user has customer role (or higher)
export const requireCustomer = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user || !['customer', 'store_owner', 'admin'].includes(req.user.role)) {
    return res.status(403).json({ error: 'Customer access required' });
  }
  next();
};

// Middleware to check if user is accessing their own resource or is admin
export const requireOwnershipOrAdmin = (userIdParam: string = 'id') => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const resourceUserId = parseInt(req.params[userIdParam]);
    
    if (req.user?.role === 'admin' || req.user?.id === resourceUserId) {
      next();
    } else {
      return res.status(403).json({ error: 'Access denied' });
    }
  };
};