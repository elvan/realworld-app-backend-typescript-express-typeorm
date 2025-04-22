import { UserService } from './user.service';

export interface Profile {
  username: string;
  bio: string;
  image: string;
  following: boolean;
}

export class ProfileService {
  private readonly userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  /**
   * Get a user profile
   * @param username Username of the profile to get
   * @param currentUserId ID of the current user (optional)
   */
  async getProfile(username: string, currentUserId?: string): Promise<Profile | null> {
    // Find user by username
    const user = await this.userService.findByUsername(username);

    if (!user) {
      return null;
    }

    // Determine if current user is following this profile
    let following = false;
    
    if (currentUserId) {
      following = await this.userService.isFollowing(currentUserId, user.id);
    }

    // Return profile data
    return {
      username: user.username,
      bio: user.bio || '',
      image: user.image || '',
      following
    };
  }
}
