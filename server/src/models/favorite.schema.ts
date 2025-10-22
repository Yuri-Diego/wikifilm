import { prisma } from "../config/database.js";
import type { Favorite as PrismaFavorite} from "../../generated/prisma/index.js";

type Favorite = PrismaFavorite;

export interface CreateFavoriteData {
    tmdbMovieId: number;
    title: string;
    posterPath?: string | null;
    backdropPath?: string | null;
    rating?: number | null;
    year?: string | null;
    overview?: string | null;
    releaseDate?: string | null;
    runtime?: number | null;
    genres?: string[];
}

export class FavoriteModel{
    static async findAll(): Promise<Favorite[]> {
        return await prisma.favorite.findMany({
            orderBy: { id: 'desc' },
        })
    }

    static async findByTmdbId(tmdbMovieId: number): Promise<Favorite | null> {
    return prisma.favorite.findUnique({
      where: { tmdbMovieId },
    });
  }

    static async create(data: CreateFavoriteData): Promise<Favorite> {
    return prisma.favorite.create({
      data: {
        tmdbMovieId: data.tmdbMovieId,
        title: data.title,
        posterPath: data.posterPath ?? null,
        backdropPath: data.backdropPath ?? null,
        rating: data.rating ?? null,
        year: data.year ?? null,
        overview: data.overview ?? null,
        releaseDate: data.releaseDate ?? null,
        runtime: data.runtime ?? null,
        genres: data.genres || [],
      },
    });
  }

  static async delete(tmdbMovieId: number): Promise<Favorite> {
    return prisma.favorite.delete({
      where: { tmdbMovieId },
    });
  }
}