import { Repository, In } from 'typeorm';
import { Article } from '../entities/Article.entity';
import { AppDataSource } from '../data-source';
import { Tag } from '../entities/Tag.entity';
import { UserService } from './user.service';
import { UserFollow } from '../entities/UserFollow.entity';
import { ArticleFavorite } from '../entities/ArticleFavorite.entity';
import slugify from 'slugify';

export interface ArticleCreateDto {
  title: string;
  description: string;
  body: string;
  tagList?: string[];
  authorId: string;
}

export interface ArticleUpdateDto {
  title?: string;
  description?: string;
  body?: string;
}

export interface ArticleFilters {
  tag?: string;
  author?: string;
  favorited?: string;
  limit: number;
  offset: number;
  currentUserId?: string;
}

export class ArticleService {
  private readonly articleRepository: Repository<Article>;
  private readonly tagRepository: Repository<Tag>;
  private readonly userFollowRepository: Repository<UserFollow>;
  private readonly articleFavoriteRepository: Repository<ArticleFavorite>;
  private readonly userService: UserService;

  constructor(articleRepository: Repository<Article>, userService: UserService) {
    this.articleRepository = articleRepository;
    this.tagRepository = AppDataSource.getRepository(Tag);
    this.userFollowRepository = AppDataSource.getRepository(UserFollow);
    this.articleFavoriteRepository = AppDataSource.getRepository(ArticleFavorite);
    this.userService = userService;
  }

  /**
   * Find all articles with optional filters
   */
  async findAll(filters: ArticleFilters): Promise<{ articles: Article[]; articlesCount: number }> {
    const { tag, author, favorited, limit, offset, currentUserId } = filters;
    
    let query = this.articleRepository.createQueryBuilder('article')
      .leftJoinAndSelect('article.author', 'author')
      .leftJoinAndSelect('article.tags', 'tags')
      .leftJoinAndSelect('article.favorites', 'favorites');

    // Filter by tag
    if (tag) {
      query = query.andWhere('tags.name = :tag', { tag });
    }

    // Filter by author
    if (author) {
      query = query.andWhere('author.username = :author', { author });
    }

    // Filter by favorited
    if (favorited) {
      query = query.innerJoin('favorites.user', 'favoriteUser', 'favoriteUser.username = :favorited', { favorited });
    }

    // Get count before applying limit and offset
    const articlesCount = await query.getCount();

    // Apply pagination
    query = query.skip(offset).take(limit);

    // Add ordering
    query = query.orderBy('article.createdAt', 'DESC');

    // Get articles
    const articles = await query.getMany();

    // Process articles for response
    for (const article of articles) {
      await this.prepareArticleResponse(article, currentUserId);
    }

    return { articles, articlesCount };
  }

  /**
   * Get articles feed (from followed users)
   */
  async getFeed(userId: string, limit: number, offset: number): Promise<{ articles: Article[]; articlesCount: number }> {
    // Get user IDs that the current user follows
    const follows = await this.userFollowRepository.find({
      where: { follower: { id: userId } },
      relations: ['following']
    });
    
    const followingIds = follows.map(follow => follow.following.id);
    
    if (followingIds.length === 0) {
      return { articles: [], articlesCount: 0 };
    }

    // Get articles from followed users
    const query = this.articleRepository.createQueryBuilder('article')
      .leftJoinAndSelect('article.author', 'author')
      .leftJoinAndSelect('article.tags', 'tags')
      .leftJoinAndSelect('article.favorites', 'favorites')
      .where('author.id IN (:...followingIds)', { followingIds })
      .orderBy('article.createdAt', 'DESC');

    // Get count before applying limit and offset
    const articlesCount = await query.getCount();

    // Apply pagination
    query.skip(offset).take(limit);

    // Get articles
    const articles = await query.getMany();

    // Process articles for response
    for (const article of articles) {
      await this.prepareArticleResponse(article, userId);
    }

    return { articles, articlesCount };
  }

  /**
   * Find article by slug
   */
  async findBySlug(slug: string, currentUserId?: string): Promise<Article | null> {
    const article = await this.articleRepository.findOne({
      where: { slug },
      relations: ['author', 'tags', 'favorites', 'favorites.user']
    });

    if (!article) {
      return null;
    }

    await this.prepareArticleResponse(article, currentUserId);
    
    return article;
  }

  /**
   * Create a new article
   */
  async create(articleData: ArticleCreateDto): Promise<Article> {
    // Find or create tags
    const tags: Tag[] = [];
    if (articleData.tagList && articleData.tagList.length > 0) {
      for (const tagName of articleData.tagList) {
        // Find existing tag or create new one
        let tag = await this.tagRepository.findOne({ where: { name: tagName } });
        
        if (!tag) {
          tag = this.tagRepository.create({ name: tagName });
          await this.tagRepository.save(tag);
        }
        
        tags.push(tag);
      }
    }

    // Find author
    const author = await this.userService.findById(articleData.authorId);
    
    if (!author) {
      throw new Error('Author not found');
    }

    // Create article
    const article = this.articleRepository.create({
      title: articleData.title,
      description: articleData.description,
      body: articleData.body,
      author,
      tags
    });

    // Generate unique slug
    const baseSlug = slugify(articleData.title, { lower: true });
    const timestamp = new Date().getTime().toString(36);
    article.slug = `${baseSlug}-${timestamp}`;

    // Save article
    await this.articleRepository.save(article);

    // Format for response
    await this.prepareArticleResponse(article, articleData.authorId);
    
    return article;
  }

  /**
   * Update an article
   */
  async update(slug: string, articleData: ArticleUpdateDto, currentUserId: string): Promise<Article | null> {
    // Find article
    const article = await this.findBySlug(slug);
    
    if (!article || article.author.id !== currentUserId) {
      return null;
    }

    // Update fields
    if (articleData.title !== undefined) {
      article.title = articleData.title;
      // Generate new slug if title changes
      const baseSlug = slugify(articleData.title, { lower: true });
      const timestamp = new Date().getTime().toString(36);
      article.slug = `${baseSlug}-${timestamp}`;
    }
    
    if (articleData.description !== undefined) {
      article.description = articleData.description;
    }
    
    if (articleData.body !== undefined) {
      article.body = articleData.body;
    }

    // Save article
    await this.articleRepository.save(article);

    // Format for response
    await this.prepareArticleResponse(article, currentUserId);
    
    return article;
  }

  /**
   * Delete an article
   */
  async delete(slug: string, currentUserId: string): Promise<boolean> {
    // Find article
    const article = await this.findBySlug(slug);
    
    if (!article || article.author.id !== currentUserId) {
      return false;
    }

    // Delete article
    await this.articleRepository.remove(article);
    
    return true;
  }

  /**
   * Favorite an article
   */
  async favorite(slug: string, userId: string): Promise<Article | null> {
    // Find article
    const article = await this.findBySlug(slug);
    
    if (!article) {
      return null;
    }

    // Check if already favorited
    const existingFavorite = await this.articleFavoriteRepository.findOne({
      where: {
        article: { id: article.id },
        user: { id: userId }
      }
    });

    if (!existingFavorite) {
      // Create favorite relationship
      const newFavorite = this.articleFavoriteRepository.create({
        article: { id: article.id },
        user: { id: userId }
      });

      await this.articleFavoriteRepository.save(newFavorite);
    }

    // Format for response
    await this.prepareArticleResponse(article, userId);
    
    return article;
  }

  /**
   * Unfavorite an article
   */
  async unfavorite(slug: string, userId: string): Promise<Article | null> {
    // Find article
    const article = await this.findBySlug(slug);
    
    if (!article) {
      return null;
    }

    // Find and remove favorite relationship
    const favorite = await this.articleFavoriteRepository.findOne({
      where: {
        article: { id: article.id },
        user: { id: userId }
      }
    });

    if (favorite) {
      await this.articleFavoriteRepository.remove(favorite);
    }

    // Format for response
    await this.prepareArticleResponse(article, userId);
    
    return article;
  }

  /**
   * Prepare article for API response
   */
  private async prepareArticleResponse(article: Article, currentUserId?: string): Promise<void> {
    // Convert tags to string array
    article.tagList = article.tags ? article.tags.map(tag => tag.name) : [];

    // Set favorited status based on current user
    if (currentUserId && article.favorites) {
      article.favorited = article.favorites.some(fav => fav.user.id === currentUserId);
    } else {
      article.favorited = false;
    }

    // Set favorites count
    article.favoritesCount = article.favorites ? article.favorites.length : 0;

    // Set following status if current user is provided
    if (currentUserId && article.author) {
      const isFollowing = await this.userService.isFollowing(currentUserId, article.author.id);
      // Set the isFollowing property on the author object
      article.author.isFollowing = isFollowing;
    }
  }
}
