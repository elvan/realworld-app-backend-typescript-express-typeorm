import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../data-source';
import { User } from '../entities/User.entity';
import jwt from 'jsonwebtoken';
import { UserService } from '../services/user.service';
import { validate } from 'class-validator';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create repository and service instances
const userRepository = AppDataSource.getRepository(User);
const userService = new UserService(userRepository);

export class UserController {
  /**
   * Register a new user
   */
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, email, password } = req.body.user;

      // Create new user
      const userData = {
        username,
        email,
        password,
        bio: '',
        image: ''
      };

      const user = await userService.create(userData);
      
      // Generate JWT
      const token = this.generateJWT(user);

      return res.status(201).json({
        user: {
          email: user.email,
          token,
          username: user.username,
          bio: user.bio || '',
          image: user.image || ''
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Login existing user
   */
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body.user;

      // Find user
      const user = await userService.findByEmail(email, true);
      
      if (!user) {
        return res.status(401).json({
          errors: {
            body: ['Email or password is invalid']
          }
        });
      }

      // Validate password
      const isPasswordValid = await user.validatePassword(password);

      if (!isPasswordValid) {
        return res.status(401).json({
          errors: {
            body: ['Email or password is invalid']
          }
        });
      }

      // Generate JWT
      const token = this.generateJWT(user);

      return res.json({
        user: {
          email: user.email,
          token,
          username: user.username,
          bio: user.bio || '',
          image: user.image || ''
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get current user
   */
  async getCurrentUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await userService.findById(req.payload.id);
      
      if (!user) {
        return res.status(401).json({
          errors: {
            body: ['User not found']
          }
        });
      }

      // Generate JWT
      const token = this.generateJWT(user);

      return res.json({
        user: {
          email: user.email,
          token,
          username: user.username,
          bio: user.bio || '',
          image: user.image || ''
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update current user
   */
  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.payload.id;
      const updates = req.body.user;

      // Find user
      const user = await userService.findById(userId);
      
      if (!user) {
        return res.status(401).json({
          errors: {
            body: ['User not found']
          }
        });
      }

      // Update fields
      if (updates.username !== undefined) {
        user.username = updates.username;
      }
      
      if (updates.email !== undefined) {
        user.email = updates.email;
      }
      
      if (updates.password !== undefined) {
        user.password = updates.password;
      }
      
      if (updates.bio !== undefined) {
        user.bio = updates.bio;
      }
      
      if (updates.image !== undefined) {
        user.image = updates.image;
      }

      // Save user
      const updatedUser = await userService.update(user);

      // Generate JWT
      const token = this.generateJWT(updatedUser);

      return res.json({
        user: {
          email: updatedUser.email,
          token,
          username: updatedUser.username,
          bio: updatedUser.bio || '',
          image: updatedUser.image || ''
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Generate JWT token for user
   */
  private generateJWT(user: User): string {
    const today = new Date();
    const exp = new Date(today);
    exp.setDate(today.getDate() + 60); // 60 days expiration

    const secret = process.env.JWT_SECRET || 'default_secret_for_dev';
    
    return jwt.sign({
      id: user.id,
      username: user.username,
      email: user.email,
      exp: Math.floor(exp.getTime() / 1000)
    }, secret);
  }
}

export const userController = new UserController();
