import { Router } from 'express';
import { authMiddleware, optionalAuthMiddleware } from '../middleware/auth.middleware';
import { articleController } from '../controllers/article.controller';

const router = Router();

/**
 * @swagger
 * /articles:
 *   get:
 *     tags:
 *       - Articles
 *     summary: Get recent articles globally
 *     description: Get most recent articles globally. Use query parameters to filter results. Auth is optional
 *     parameters:
 *       - name: tag
 *         in: query
 *         description: Filter by tag
 *         schema:
 *           type: string
 *       - name: author
 *         in: query
 *         description: Filter by author (username)
 *         schema:
 *           type: string
 *       - name: favorited
 *         in: query
 *         description: Filter by favorites of a user (username)
 *         schema:
 *           type: string
 *       - name: limit
 *         in: query
 *         description: Limit number of articles returned (default is 20)
 *         schema:
 *           type: integer
 *           default: 20
 *       - name: offset
 *         in: query
 *         description: Offset/skip number of articles (default is 0)
 *         schema:
 *           type: integer
 *           default: 0
 *     responses:
 *       200:
 *         description: Articles successfully retrieved
 */
router.get('/', optionalAuthMiddleware, (req, res, next) => 
  articleController.getArticles(req, res, next)
);

/**
 * @swagger
 * /articles/feed:
 *   get:
 *     tags:
 *       - Articles
 *     summary: Get recent articles from users you follow
 *     description: Get most recent articles from users you follow. Use query parameters to limit. Auth is required
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: limit
 *         in: query
 *         description: Limit number of articles returned (default is 20)
 *         schema:
 *           type: integer
 *           default: 20
 *       - name: offset
 *         in: query
 *         description: Offset/skip number of articles (default is 0)
 *         schema:
 *           type: integer
 *           default: 0
 *     responses:
 *       200:
 *         description: Feed articles successfully retrieved
 *       401:
 *         description: Unauthorized
 */
router.get('/feed', authMiddleware, (req, res, next) => 
  articleController.getFeed(req, res, next)
);

/**
 * @swagger
 * /articles:
 *   post:
 *     tags:
 *       - Articles
 *     summary: Create an article
 *     description: Create an article. Auth is required
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               article:
 *                 type: object
 *                 properties:
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 *                   body:
 *                     type: string
 *                   tagList:
 *                     type: array
 *                     items:
 *                       type: string
 *     responses:
 *       201:
 *         description: Article created successfully
 *       401:
 *         description: Unauthorized
 *       422:
 *         description: Validation Error
 */
router.post('/', authMiddleware, (req, res, next) => 
  articleController.createArticle(req, res, next)
);

/**
 * @swagger
 * /articles/{slug}:
 *   get:
 *     tags:
 *       - Articles
 *     summary: Get an article
 *     description: Get an article. Auth not required
 *     parameters:
 *       - name: slug
 *         in: path
 *         description: Slug of the article to get
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Article retrieved successfully
 *       404:
 *         description: Article not found
 */
router.get('/:slug', optionalAuthMiddleware, (req, res, next) => 
  articleController.getArticle(req, res, next)
);

/**
 * @swagger
 * /articles/{slug}:
 *   put:
 *     tags:
 *       - Articles
 *     summary: Update an article
 *     description: Update an article. Auth is required
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: slug
 *         in: path
 *         description: Slug of the article to update
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               article:
 *                 type: object
 *                 properties:
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 *                   body:
 *                     type: string
 *     responses:
 *       200:
 *         description: Article updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Article not found
 *       422:
 *         description: Validation Error
 */
router.put('/:slug', authMiddleware, (req, res, next) => 
  articleController.updateArticle(req, res, next)
);

/**
 * @swagger
 * /articles/{slug}:
 *   delete:
 *     tags:
 *       - Articles
 *     summary: Delete an article
 *     description: Delete an article. Auth is required
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: slug
 *         in: path
 *         description: Slug of the article to delete
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Article deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Article not found
 */
router.delete('/:slug', authMiddleware, (req, res, next) => 
  articleController.deleteArticle(req, res, next)
);

/**
 * @swagger
 * /articles/{slug}/favorite:
 *   post:
 *     tags:
 *       - Favorites
 *     summary: Favorite an article
 *     description: Favorite an article. Auth is required
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: slug
 *         in: path
 *         description: Slug of the article to favorite
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Article favorited successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Article not found
 */
router.post('/:slug/favorite', authMiddleware, (req, res, next) => 
  articleController.favoriteArticle(req, res, next)
);

/**
 * @swagger
 * /articles/{slug}/favorite:
 *   delete:
 *     tags:
 *       - Favorites
 *     summary: Unfavorite an article
 *     description: Unfavorite an article. Auth is required
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: slug
 *         in: path
 *         description: Slug of the article to unfavorite
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Article unfavorited successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Article not found
 */
router.delete('/:slug/favorite', authMiddleware, (req, res, next) => 
  articleController.unfavoriteArticle(req, res, next)
);

/**
 * @swagger
 * /articles/{slug}/comments:
 *   get:
 *     tags:
 *       - Comments
 *     summary: Get comments for an article
 *     description: Get the comments for an article. Auth is optional
 *     parameters:
 *       - name: slug
 *         in: path
 *         description: Slug of the article to get comments for
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comments retrieved successfully
 *       404:
 *         description: Article not found
 */
router.get('/:slug/comments', optionalAuthMiddleware, (req, res, next) => 
  articleController.getComments(req, res, next)
);

/**
 * @swagger
 * /articles/{slug}/comments:
 *   post:
 *     tags:
 *       - Comments
 *     summary: Create a comment for an article
 *     description: Create a comment for an article. Auth is required
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: slug
 *         in: path
 *         description: Slug of the article to comment on
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               comment:
 *                 type: object
 *                 properties:
 *                   body:
 *                     type: string
 *     responses:
 *       200:
 *         description: Comment created successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Article not found
 *       422:
 *         description: Validation Error
 */
router.post('/:slug/comments', authMiddleware, (req, res, next) => 
  articleController.addComment(req, res, next)
);

/**
 * @swagger
 * /articles/{slug}/comments/{id}:
 *   delete:
 *     tags:
 *       - Comments
 *     summary: Delete a comment for an article
 *     description: Delete a comment for an article. Auth is required
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: slug
 *         in: path
 *         description: Slug of the article that has the comment
 *         required: true
 *         schema:
 *           type: string
 *       - name: id
 *         in: path
 *         description: ID of the comment to delete
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Comment or article not found
 */
router.delete('/:slug/comments/:id', authMiddleware, (req, res, next) => 
  articleController.deleteComment(req, res, next)
);

export default router;
