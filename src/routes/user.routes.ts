import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { userController } from '../controllers/user.controller';

const router = Router();

/**
 * @swagger
 * /users/login:
 *   post:
 *     tags:
 *       - User and Authentication
 *     summary: Existing user login
 *     description: Login for existing user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
 *                 type: object
 *                 properties:
 *                   email:
 *                     type: string
 *                   password:
 *                     type: string
 *     responses:
 *       200:
 *         description: User authenticated successfully
 *       401:
 *         description: Unauthorized
 *       422:
 *         description: Validation Error
 */
router.post('/login', (req, res, next) => userController.login(req, res, next));

/**
 * @swagger
 * /users:
 *   post:
 *     tags:
 *       - User and Authentication
 *     summary: Register a new user
 *     description: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
 *                 type: object
 *                 properties:
 *                   username:
 *                     type: string
 *                   email:
 *                     type: string
 *                   password:
 *                     type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       422:
 *         description: Validation Error
 */
router.post('/', (req, res, next) => userController.register(req, res, next));

/**
 * @swagger
 * /user:
 *   get:
 *     tags:
 *       - User and Authentication
 *     summary: Get current user
 *     description: Gets the currently logged-in user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user
 *       401:
 *         description: Unauthorized
 */
router.get('/', authMiddleware, (req, res, next) => userController.getCurrentUser(req, res, next));

/**
 * @swagger
 * /user:
 *   put:
 *     tags:
 *       - User and Authentication
 *     summary: Update current user
 *     description: Updated user information for current user
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
 *                 type: object
 *                 properties:
 *                   username:
 *                     type: string
 *                   email:
 *                     type: string
 *                   password:
 *                     type: string
 *                   bio:
 *                     type: string
 *                   image:
 *                     type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *       401:
 *         description: Unauthorized
 *       422:
 *         description: Validation Error
 */
router.put('/', authMiddleware, (req, res, next) => userController.updateUser(req, res, next));

export default router;
