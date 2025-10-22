import type { Request, Response } from 'express';
import { getTMDbService } from '../tmdb.service.js';

export class MoviesController {
  static async search(req: Request, res: Response): Promise<void> {
    try {
      const query = req.query.query as string;

      if (!query) {
        res.status(400).json({ error: 'Query parameter is required' });
        return;
      }

      const tmdb = getTMDbService();
      const movies = await tmdb.searchMovies(query);

      res.json(movies);
    } catch (error) {
      console.error('Error searching movies:', error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Failed to search movies' 
      });
    }
  }
}