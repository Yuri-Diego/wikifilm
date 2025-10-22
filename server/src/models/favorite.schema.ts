import { prisma } from "../config/database.js";
import type { Favorite as PrismaFavorite} from "../../generated/prisma/index.js";

type Favorite = PrismaFavorite;

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

    static async create(data: any): Promise<Favorite> {
        return prisma.favorite.create({
        data: data
        });
    }

    static async delete(tmdbMovieId: number): Promise<Favorite> {
        return prisma.favorite.delete({
        where: { tmdbMovieId },
        });
    }
}