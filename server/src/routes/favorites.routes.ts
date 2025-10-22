import { Router } from 'express';
import { FavoritesController } from '../controllers/favorites.controller.js';

const router = Router();

router.get('/', FavoritesController.getAll)

router.post('/', FavoritesController.create)

router.delete('/:tmdbMovieId', FavoritesController.delete)

export default router;