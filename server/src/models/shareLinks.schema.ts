import { prisma } from "../config/database.js";
import type { ShareLink as PrismaShareLink, Favorite as PrismaFavorite } from '@prisma/client';
import { randomUUID } from 'crypto';

type ShareLink = PrismaShareLink;
type Favorite = PrismaFavorite;

export interface ShareLinkWithMovies extends ShareLink {
    moviesData: Favorite[]
}

export class ShareLinkModel {
    static async create(favorites: Favorite[]): Promise<ShareLink>{
        const shareId = randomUUID();

        return prisma.shareLink.create({
            data: {
                shareId,
                moviesData: favorites as any
            }
        })
    }

    static async findByShareId(shareId: string): Promise<ShareLinkWithMovies | null> {
    const shareLink = await prisma.shareLink.findUnique({
      where: { shareId },
    });

    if (!shareLink) {
      return null;
    }

    return {
      ...shareLink,
      moviesData: shareLink.moviesData as Favorite[],
    };
  }
}