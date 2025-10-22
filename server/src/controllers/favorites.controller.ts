import type { Request, Response } from 'express';
import { FavoriteModel, type CreateFavoriteData } from '../models/favorite.schema.js';
import z from 'zod';

const createFavoriteSchema = z.object({
  tmdbMovieId: z.number(),
  title: z.string(),
  posterPath: z.string().nullable().optional(),
  backdropPath: z.string().nullable().optional(),
  rating: z.number().nullable().optional(),
  year: z.string().nullable().optional(),
  overview: z.string().nullable().optional(),
  releaseDate: z.string().nullable().optional(),
  runtime: z.number().nullable().optional(),
  genres: z.array(z.string()).optional(),
});

export class FavoritesController {
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const favorites = await FavoriteModel.findAll();
      res.status(200).json({message: 'success', data: favorites});
    } catch (error) {
      console.error('Error fetching favorites:', error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Failed to fetch favorites' 
      });
    }
  }

  static async create(req: Request, res: Response): Promise<void> {
    try {
      const validatedData = createFavoriteSchema.parse(req.body);

      const existing = await FavoriteModel.findByTmdbId(validatedData.tmdbMovieId);
      if (existing) {
        res.status(409).json({ error: 'Movie already in favorites' });
        return;
      }

      const favorite = await FavoriteModel.create(validatedData as CreateFavoriteData);
      res.status(201).json({message: 'success', data: favorite});
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: 'Invalid request data', details: error.issues });
        return;
      }
      console.error('Error adding favorite:', error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Failed to add favorite' 
      });
    }
  }

  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const idParam = req.params.tmdbMovieId;
      if (!idParam) {
        res.status(400).json({ error: 'Missing movie ID' });
        return;
      }

      const tmdbMovieId = parseInt(idParam, 10);

      if (isNaN(tmdbMovieId)) {
        res.status(400).json({ error: 'Invalid movie ID' });
        return;
      }

      await FavoriteModel.delete(tmdbMovieId);
      res.status(204).send();
    } catch (error) {
      console.error('Error removing favorite:', error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Failed to remove favorite' 
      });
    }
  }

}