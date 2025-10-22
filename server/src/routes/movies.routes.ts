import { Router } from 'express';
import { MoviesController } from '../controllers/movies.controller.js';

const router = Router();

router.get('/search', MoviesController.search);
router.get('/:id', MoviesController.getDetails)


export default router;