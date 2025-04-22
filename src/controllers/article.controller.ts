import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../data-source';
import { Article } from '../entities/Article.entity';
import { User } from '../entities/User.entity';
import { ArticleService } from '../services/article.service';
import { UserService } from '../services/user.service';
import { CommentService } from '../services/comment.service';

// Create repository and service instances
const articleRepository = AppDataSource.getRepository(Article);
const userRepository = AppDataSource.getRepository(User);
const userService = new UserService(userRepository);
const articleService = new ArticleService(articleRepository, userService);
const commentService = new CommentService();

export class ArticleController {
  /**
   * Get articles with filters
   */
  async getArticles(req: Request, res: Response, next: NextFunction) {
    try {
      const { tag, author, favorited } = req.query;
      const limit = parseInt(req.query.limit as string) || 20;
      const offset = parseInt(req.query.offset as string) || 0;
      const currentUserId = req.payload?.id;

      const { articles, articlesCount } = await articleService.findAll({
        tag: tag as string,
        author: author as string,
        favorited: favorited as string,
        limit,
        offset,
        currentUserId
      });

      return res.json({ articles, articlesCount });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get articles feed (articles from followed users)
   */
  async getFeed(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const offset = parseInt(req.query.offset as string) || 0;
      const currentUserId = req.payload.id;

      const { articles, articlesCount } = await articleService.getFeed(
        currentUserId,
        limit,
        offset
      );

      return res.json({ articles, articlesCount });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get a single article by slug
   */
  async getArticle(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params;
      const currentUserId = req.payload?.id;

      const article = await articleService.findBySlug(slug, currentUserId);
      
      if (!article) {
        return res.status(404).json({
          errors: {
            body: ['Article not found']
          }
        });
      }

      return res.json({ article });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create a new article
   */
  async createArticle(req: Request, res: Response, next: NextFunction) {
    try {
      const { title, description, body, tagList } = req.body.article;
      const currentUserId = req.payload.id;

      const article = await articleService.create({
        title,
        description,
        body,
        tagList,
        authorId: currentUserId
      });

      return res.status(201).json({ article });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update an existing article
   */
  async updateArticle(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params;
      const { title, description, body } = req.body.article;
      const currentUserId = req.payload.id;

      const article = await articleService.update(
        slug,
        { title, description, body },
        currentUserId
      );

      if (!article) {
        return res.status(404).json({
          errors: {
            body: ['Article not found or you are not the author']
          }
        });
      }

      return res.json({ article });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete an article
   */
  async deleteArticle(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params;
      const currentUserId = req.payload.id;

      const result = await articleService.delete(slug, currentUserId);

      if (!result) {
        return res.status(404).json({
          errors: {
            body: ['Article not found or you are not the author']
          }
        });
      }

      return res.json({ message: 'Article successfully deleted' });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Favorite an article
   */
  async favoriteArticle(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params;
      const currentUserId = req.payload.id;

      const article = await articleService.favorite(slug, currentUserId);

      if (!article) {
        return res.status(404).json({
          errors: {
            body: ['Article not found']
          }
        });
      }

      return res.json({ article });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Unfavorite an article
   */
  async unfavoriteArticle(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params;
      const currentUserId = req.payload.id;

      const article = await articleService.unfavorite(slug, currentUserId);

      if (!article) {
        return res.status(404).json({
          errors: {
            body: ['Article not found']
          }
        });
      }

      return res.json({ article });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get comments for an article
   */
  async getComments(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params;
      const currentUserId = req.payload?.id;

      const article = await articleService.findBySlug(slug);
      
      if (!article) {
        return res.status(404).json({
          errors: {
            body: ['Article not found']
          }
        });
      }

      const comments = await commentService.findByArticle(slug, currentUserId);

      return res.json({ comments });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Add a comment to an article
   */
  async addComment(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params;
      const { body } = req.body.comment;
      const currentUserId = req.payload.id;

      const article = await articleService.findBySlug(slug);
      
      if (!article) {
        return res.status(404).json({
          errors: {
            body: ['Article not found']
          }
        });
      }

      const comment = await commentService.create({
        body,
        articleSlug: slug,
        authorId: currentUserId
      });

      return res.json({ comment });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete a comment
   */
  async deleteComment(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug, id } = req.params;
      const currentUserId = req.payload.id;

      const result = await commentService.delete(
        parseInt(id),
        slug,
        currentUserId
      );

      if (!result) {
        return res.status(404).json({
          errors: {
            body: ['Comment not found or you are not the author']
          }
        });
      }

      return res.json({ message: 'Comment successfully deleted' });
    } catch (error) {
      next(error);
    }
  }
}

export const articleController = new ArticleController();
