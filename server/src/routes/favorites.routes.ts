import { Router } from 'express';
import { FavoritesController } from '../controllers/favorites.controller.js';

const router = Router();

/**
 * @swagger
 * /api/favorites:
 *   get:
 *     summary: Lista todos os favoritos
 *     description: Retorna a lista de filmes favoritos
 *     tags: [Favorites]
 *     responses:
 *       200:
 *         description: Lista de favoritos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Favorite'
 */
router.get('/', FavoritesController.getAll)

/**
 * @swagger
 * /api/favorites:
 *   post:
 *     summary: Adiciona filme aos favoritos
 *     description: Adiciona um filme à lista de favoritos
 *     tags: [Favorites]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tmdbMovieId
 *               - title
 *             properties:
 *               tmdbMovieId:
 *                 type: integer
 *                 example: 1062722
 *               title:
 *                 type: string
 *                 example: "Frankenstein"
 *               posterPath:
 *                 type: string
 *                 example: "/7epNZFNXjqc3wZ5rMgFVqskkohr.jpg"
 *               backdropPath:
 *                 type: string
 *                 example: "/sy7Y4jCDsGPCzoQIEmxqAgPjAgr.jpg"
 *               rating:
 *                 type: number
 *                 example: 8.7
 *               year:
 *                 type: string
 *                 example: "2025"
 *               overview:
 *                 type: string
 *                 example: "Dr. Victor Frankenstein, a brilliant but egotistical scientist..."
 *               releaseDate:
 *                 type: string
 *                 nullable: true
 *                 example: "2025-10-17"
 *               runtime:
 *                 type: integer
 *                 nullable: true
 *                 example: 150
 *               genres:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Drama", "Horror", "Science Fiction"]
 *     responses:
 *       201:
 *         description: Favorito criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   $ref: '#/components/schemas/Favorite'
 *       400:
 *         description: Dados inválidos
 *       409:
 *         description: Filme já está nos favoritos
 */
router.post('/', FavoritesController.create)

/**
 * @swagger
 * /api/favorites/{tmdbMovieId}:
 *   delete:
 *     summary: Remove filme dos favoritos
 *     description: Remove um filme da lista de favoritos
 *     tags: [Favorites]
 *     parameters:
 *       - in: path
 *         name: tmdbMovieId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do filme no TMDb
 *         example: 68735
 *     responses:
 *       200:
 *         description: Favorito removido com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "success"
 *       404:
 *         description: Favorito não encontrado
 */
router.delete('/:tmdbMovieId', FavoritesController.delete)

export default router;