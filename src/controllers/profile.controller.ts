import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../data-source';
import { User } from '../entities/User.entity';
import { UserService } from '../services/user.service';
import { ProfileService } from '../services/profile.service';

// Create repository and service instances
const userRepository = AppDataSource.getRepository(User);
const userService = new UserService(userRepository);
const profileService = new ProfileService(userService);

export class ProfileController {
  /**
   * Get a user profile
   */
  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const { username } = req.params;
      const currentUserId = req.payload?.id;

      const profile = await profileService.getProfile(username, currentUserId);
      
      if (!profile) {
        return res.status(404).json({
          errors: {
            body: ['Profile not found']
          }
        });
      }

      return res.json({ profile });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Follow a user
   */
  async followUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { username } = req.params;
      const currentUserId = req.payload.id;

      await userService.followUser(currentUserId, username);
      
      const profile = await profileService.getProfile(username, currentUserId);
      
      if (!profile) {
        return res.status(404).json({
          errors: {
            body: ['Profile not found']
          }
        });
      }

      return res.json({ profile });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Unfollow a user
   */
  async unfollowUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { username } = req.params;
      const currentUserId = req.payload.id;

      await userService.unfollowUser(currentUserId, username);
      
      const profile = await profileService.getProfile(username, currentUserId);
      
      if (!profile) {
        return res.status(404).json({
          errors: {
            body: ['Profile not found']
          }
        });
      }

      return res.json({ profile });
    } catch (error) {
      next(error);
    }
  }
}

export const profileController = new ProfileController();
