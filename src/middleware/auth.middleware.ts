import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../data-source';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Extend Express Request type to include user property
declare global {
  namespace Express {
    interface Request {
      user?: any;
      payload?: any;
    }
  }
}

/**
 * Authentication middleware for protected routes
 * Verifies JWT token from Authorization header
 */
export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Token ')) {
      return res.status(401).json({
        errors: {
          body: ['Authorization token missing']
        }
      });
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'default_secret_for_dev';
    
    try {
      const decoded = jwt.verify(token, secret);
      req.payload = decoded;
      
      // Load the user for the request context
      // This will be implemented later when the User entity is created
      // For now, we just attach the decoded payload
      
      next();
    } catch (error) {
      return res.status(401).json({
        errors: {
          body: ['Invalid token']
        }
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Optional authentication middleware
 * Tries to verify JWT token but continues if token is invalid or missing
 */
export const optionalAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Token ')) {
      const token = authHeader.split(' ')[1];
      const secret = process.env.JWT_SECRET || 'default_secret_for_dev';
      
      try {
        const decoded = jwt.verify(token, secret);
        req.payload = decoded;
        
        // Load the user for the request context
        // This will be implemented later when the User entity is created
      } catch (error) {
        // Invalid token, but since this is optional auth, we continue
      }
    }
    
    next();
  } catch (error) {
    next(error);
  }
};
