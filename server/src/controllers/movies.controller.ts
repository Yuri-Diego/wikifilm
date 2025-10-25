import type { Request, Response } from 'express';
import { getTMDbService } from '../tmdb.service.js';

const tmdb = getTMDbService();

export class MoviesController {
  static async search(req: Request, res: Response): Promise<void> {
    try {
      const query = req.query.query as string;
      const page = parseInt(req.query.page as string)

      if (!query) {
        res.status(400).json({ error: 'Query parameter is required' });
        return;
      }

      const movies = await tmdb.searchMovies(query, page);

      res.status(200).json({message: 'success', data: movies});
    } catch (error) {
      console.error('Error searching movies:', error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Failed to search movies' 
      });
    }
  }

  static async getDetails(req: Request, res: Response): Promise<void> {
    try {
      if (!req.params.id) {
        res.status(400).json({ error: 'Movie ID is required' });
        return;
      }

      const movieId = parseInt(req.params.id);

      if (isNaN(movieId)) {
        res.status(400).json({ error: 'Invalid movie ID' });
        return;
      }

      const movie = await tmdb.getMovieDetails(movieId);

      res.json(movie);
    } catch (error) {
      console.error('Error fetching movie details:', error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Failed to fetch movie details' 
      });
    }
  }

  static async getRecentMovies(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string);

      if (!page) {
        res.status(400).json({ error: 'page parameter is required' });
        return;
      }

      const movies = await tmdb.getRecentMovies(page);

      res.status(200).json({message: 'success', data: movies});
    } catch (error) {
      console.error('Error searching movies:', error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Failed to search movies' 
      });
    }
  }
}