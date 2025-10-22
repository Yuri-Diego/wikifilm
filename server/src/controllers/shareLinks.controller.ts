import type { Request, Response } from 'express';
import { ShareLinkModel } from '../models/shareLinks.schema.js';
import { FavoriteModel } from '../models/favorite.schema.js';

export class ShareLinksController {
  static async create(req: Request, res: Response): Promise<void> {
    try {
      const favorites = await FavoriteModel.findAll();

      if (favorites.length === 0) {
        res.status(400).json({ error: 'No favorites to share' });
        return;
      }

      const shareLink = await ShareLinkModel.create(favorites);
      res.status(201).json(shareLink);
    } catch (error) {
      console.error('Error creating share link:', error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Failed to create share link' 
      });
    }
  }

  static async getByShareId(req: Request, res: Response): Promise<void> {
    try {
      const shareId = req.params.shareId;
      if (!shareId) {
        res.status(400).json({ error: 'Missing movie ID' });
        return;
      }

      const shareLink = await ShareLinkModel.findByShareId(shareId);

      if (!shareLink) {
        res.status(404).json({ error: 'Share link not found' });
        return;
      }

      res.json({
        shareId: shareLink.shareId,
        createdAt: shareLink.createdAt,
        favorites: shareLink.moviesData,
      });
    } catch (error) {
      console.error('Error fetching shared favorites:', error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Failed to fetch shared favorites' 
      });
    }
  }
}