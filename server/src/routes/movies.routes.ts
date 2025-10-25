import { Router } from 'express';
import { MoviesController } from '../controllers/movies.controller.js';

const router = Router();

/**
 * @swagger
 * /api/movies/recent:
 *   get:
 *     summary: Busca filmes recentes
 *     description: Retorna uma lista dos filmes mais recentes do TMDb
 *     tags: [Movies]
 *     responses:
 *       200:
 *         description: Lista de filmes recentes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   type: object
 *                   properties:
 *                     movies:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Movie'
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     totalPages:
 *                       type: integer
 *                       example: 500
 *                     totalResults:
 *                       type: integer
 *                       example: 94757
 *       500:
 *         description: Erro ao buscar filmes
 */
router.get('/recent', MoviesController.getRecentMovies);

/**
 * @swagger
 * /api/movies/search:
 *   get:
 *     summary: Busca filmes por título
 *     description: Pesquisa filmes no TMDb usando um termo de busca
 *     tags: [Movies]
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Termo de busca
 *         example: "Fight Club"
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número da página
 *     responses:
 *       200:
 *         description: Resultados da busca
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   type: object
 *                   properties:
 *                     movies:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Movie'
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     totalPages:
 *                       type: integer
 *                       example: 3
 *                     totalResults:
 *                       type: integer
 *                       example: 56
 *       500:
 *         description: Erro ao buscar filmes
 */
router.get('/search', MoviesController.search);

/**
 * @swagger
 * /api/movies/{id}:
 *   get:
 *     summary: Busca detalhes de um filme
 *     description: Retorna informações detalhadas de um filme específico
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do filme no TMDb
 *         example: 550
 *     responses:
 *       200:
 *         description: Detalhes do filme
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movie'
 *       404:
 *         description: Filme não encontrado
 */
router.get('/:id', MoviesController.getDetails);


export default router;