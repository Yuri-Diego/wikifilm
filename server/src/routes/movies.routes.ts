import { Router } from 'express';
import { MoviesController } from '../controllers/movies.controller.js';

const router = Router();

router.get('/search', MoviesController.search);


export default router;