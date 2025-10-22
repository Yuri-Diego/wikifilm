import { Router } from 'express';
import moviesRoutes from './routes/movies.routes.js';

const router = Router();

router.use('/movies', moviesRoutes);

export default router;