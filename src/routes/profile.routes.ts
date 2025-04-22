import { Router } from 'express';
import { authMiddleware, optionalAuthMiddleware } from '../middleware/auth.middleware';
import { profileController } from '../controllers/profile.controller';

const router = Router();

/**
 * @swagger
 * /profiles/{username}:
 *   get:
 *     tags:
 *       - Profile
 *     summary: Get a profile
 *     description: Get a profile of a user of the system. Auth is optional
 *     parameters:
 *       - name: username
 *         in: path
 *         description: Username of the profile to get
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *       404:
 *         description: Profile not found
 */
router.get('/:username', optionalAuthMiddleware, (req, res, next) => 
  profileController.getProfile(req, res, next)
);

/**
 * @swagger
 * /profiles/{username}/follow:
 *   post:
 *     tags:
 *       - Profile
 *     summary: Follow a user
 *     description: Follow a user by username
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: username
 *         in: path
 *         description: Username of the profile you want to follow
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Profile retrieved with followed status
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Profile not found
 */
router.post('/:username/follow', authMiddleware, (req, res, next) => 
  profileController.followUser(req, res, next)
);

/**
 * @swagger
 * /profiles/{username}/follow:
 *   delete:
 *     tags:
 *       - Profile
 *     summary: Unfollow a user
 *     description: Unfollow a user by username
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: username
 *         in: path
 *         description: Username of the profile you want to unfollow
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Profile retrieved with unfollowed status
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Profile not found
 */
router.delete('/:username/follow', authMiddleware, (req, res, next) => 
  profileController.unfollowUser(req, res, next)
);

export default router;
