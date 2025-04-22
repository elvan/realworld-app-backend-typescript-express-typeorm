import { Router } from 'express';
import userRoutes from './user.routes';
import profileRoutes from './profile.routes';
import articleRoutes from './article.routes';
import tagRoutes from './tag.routes';

export const routes = Router();

// Register all route modules
routes.use('/users', userRoutes);
routes.use('/user', userRoutes);
routes.use('/profiles', profileRoutes);
routes.use('/articles', articleRoutes);
routes.use('/tags', tagRoutes);

export default routes;
