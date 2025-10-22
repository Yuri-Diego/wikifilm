import { Router } from 'express';
import moviesRoutes from './routes/movies.routes.js';
import favoritesRoutes from './routes/favorites.routes.js'
import shareLinksRoutes from './routes/shareLinks.routes.js'

const router = Router();

router.use('/movies', moviesRoutes);
router.use('/favorites', favoritesRoutes);
router.use('/favorites/share', shareLinksRoutes);

export default router;