import { Router } from 'express';
import { tagController } from '../controllers/tag.controller';

const router = Router();

/**
 * @swagger
 * /tags:
 *   get:
 *     tags:
 *       - Tags
 *     summary: Get tags
 *     description: Get all tags. Auth not required
 *     responses:
 *       200:
 *         description: Tags retrieved successfully
 */
router.get('/', (req, res, next) => tagController.getTags(req, res, next));

export default router;
