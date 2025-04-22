import { Repository } from 'typeorm';
import { User } from '../entities/User.entity';
import { AppDataSource } from '../data-source';
import { UserFollow } from '../entities/UserFollow.entity';

export class UserService {
  private readonly userRepository: Repository<User>;
  private readonly userFollowRepository: Repository<UserFollow>;

  constructor(userRepository: Repository<User>) {
    this.userRepository = userRepository;
    this.userFollowRepository = AppDataSource.getRepository(UserFollow);
  }

  /**
   * Create a new user
   */
  async create(userData: Partial<User>): Promise<User> {
    // Check if username or email already exists
    const existingUser = await this.userRepository.findOne({
      where: [
        { username: userData.username },
        { email: userData.email }
      ]
    });

    if (existingUser) {
      const field = existingUser.username === userData.username ? 'username' : 'email';
      const error = new Error(`${field} already exists`);
      (error as any).status = 422;
      throw error;
    }

    // Create new user
    const user = this.userRepository.create(userData);
    return this.userRepository.save(user);
  }

  /**
   * Find user by ID
   */
  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  /**
   * Find user by email
   * @param includePassword Whether to include the password field
   */
  async findByEmail(email: string, includePassword: boolean = false): Promise<User | null> {
    const query = this.userRepository.createQueryBuilder('user')
      .where('user.email = :email', { email });

    if (includePassword) {
      query.addSelect('user.password');
    }

    return query.getOne();
  }

  /**
   * Find user by username
   */
  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { username } });
  }

  /**
   * Update user
   */
  async update(user: User): Promise<User> {
    return this.userRepository.save(user);
  }

  /**
   * Follow a user
   */
  async followUser(currentUserId: string, targetUsername: string): Promise<boolean> {
    // Find the target user
    const targetUser = await this.findByUsername(targetUsername);

    if (!targetUser) {
      const error = new Error('User not found');
      (error as any).status = 404;
      throw error;
    }

    // Check if already following
    const existingFollow = await this.userFollowRepository.findOne({
      where: {
        follower: { id: currentUserId },
        following: { id: targetUser.id }
      }
    });

    if (existingFollow) {
      return true; // Already following
    }

    // Create follow relationship
    const newFollow = this.userFollowRepository.create({
      follower: { id: currentUserId },
      following: { id: targetUser.id }
    });

    await this.userFollowRepository.save(newFollow);
    return true;
  }

  /**
   * Unfollow a user
   */
  async unfollowUser(currentUserId: string, targetUsername: string): Promise<boolean> {
    // Find the target user
    const targetUser = await this.findByUsername(targetUsername);

    if (!targetUser) {
      const error = new Error('User not found');
      (error as any).status = 404;
      throw error;
    }

    // Find and remove follow relationship
    const follow = await this.userFollowRepository.findOne({
      where: {
        follower: { id: currentUserId },
        following: { id: targetUser.id }
      }
    });

    if (follow) {
      await this.userFollowRepository.remove(follow);
    }

    return true;
  }

  /**
   * Check if user is following another user
   */
  async isFollowing(currentUserId: string, targetUserId: string): Promise<boolean> {
    const follow = await this.userFollowRepository.findOne({
      where: {
        follower: { id: currentUserId },
        following: { id: targetUserId }
      }
    });

    return !!follow;
  }
}
