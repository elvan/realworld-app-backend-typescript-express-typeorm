import { Repository } from 'typeorm';
import { Comment } from '../entities/Comment.entity';
import { AppDataSource } from '../data-source';
import { Article } from '../entities/Article.entity';
import { User } from '../entities/User.entity';
import { UserService } from './user.service';

export interface CommentCreateDto {
  body: string;
  articleSlug: string;
  authorId: string;
}

export class CommentService {
  private readonly commentRepository: Repository<Comment>;
  private readonly articleRepository: Repository<Article>;
  private readonly userRepository: Repository<User>;
  private readonly userService: UserService;

  constructor() {
    this.commentRepository = AppDataSource.getRepository(Comment);
    this.articleRepository = AppDataSource.getRepository(Article);
    this.userRepository = AppDataSource.getRepository(User);
    this.userService = new UserService(this.userRepository);
  }

  /**
   * Find comments for an article
   */
  async findByArticle(slug: string, currentUserId?: string): Promise<Comment[]> {
    // Find article
    const article = await this.articleRepository.findOne({ where: { slug } });
    
    if (!article) {
      return [];
    }

    // Get comments
    const comments = await this.commentRepository.find({
      where: { article: { id: article.id } },
      relations: ['author'],
      order: { createdAt: 'DESC' }
    });

    // Set following status if current user is provided
    if (currentUserId) {
      for (const comment of comments) {
        if (comment.author) {
          const isFollowing = await this.userService.isFollowing(currentUserId, comment.author.id);
          comment.author.isFollowing = isFollowing;
        }
      }
    }

    return comments;
  }

  /**
   * Find a comment by ID
   */
  async findById(id: number, currentUserId?: string): Promise<Comment | null> {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['author', 'article']
    });

    if (!comment) {
      return null;
    }

    // Set following status if current user is provided
    if (currentUserId && comment.author) {
      const isFollowing = await this.userService.isFollowing(currentUserId, comment.author.id);
      comment.author.isFollowing = isFollowing;
    }

    return comment;
  }

  /**
   * Create a new comment
   */
  async create(commentData: CommentCreateDto): Promise<Comment> {
    // Find article
    const article = await this.articleRepository.findOne({
      where: { slug: commentData.articleSlug }
    });
    
    if (!article) {
      throw new Error('Article not found');
    }

    // Find author
    const author = await this.userService.findById(commentData.authorId);
    
    if (!author) {
      throw new Error('Author not found');
    }

    // Create comment
    const comment = this.commentRepository.create({
      body: commentData.body,
      article,
      author
    });

    // Save comment
    await this.commentRepository.save(comment);

    // Set author following status
    author.isFollowing = false;
    comment.author = author;

    return comment;
  }

  /**
   * Delete a comment
   */
  async delete(id: number, articleSlug: string, currentUserId: string): Promise<boolean> {
    // Find comment
    const comment = await this.findById(id);
    
    if (!comment || comment.author.id !== currentUserId) {
      return false;
    }

    // Verify article
    if (comment.article.slug !== articleSlug) {
      return false;
    }

    // Delete comment
    await this.commentRepository.remove(comment);
    
    return true;
  }
}
