import { Router } from 'express';
import { ShareLinksController } from '../controllers/shareLinks.controller.js';

const router = Router();

/**
 * @swagger
 * /api/favorites/share:
 *   post:
 *     summary: Cria link de compartilhamento
 *     description: Gera um link único para compartilhar a lista de favoritos
 *     tags: [Share Links]
 *     responses:
 *       201:
 *         description: Link criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               schema:
 *               $ref: '#/components/schemas/ShareLink'
 *       401:
 *         description: Não autorizado
 */
router.post('/', ShareLinksController.create);

/**
 * @swagger
 * /api/favorites/share/{shareId}:
 *   get:
 *     summary: Acessa favoritos compartilhados
 *     description: Visualiza a lista de favoritos através de um link de compartilhamento
 *     tags: [Share Links]
 *     parameters:
 *       - in: path
 *         name: shareId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID único do compartilhamento
 *         example: "abc123xyz"
 *     responses:
 *       200:
 *         description: Lista de favoritos compartilhados
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ShareLink'
 *       404:
 *         description: Link não encontrado ou expirado
 */
router.get('/:shareId', ShareLinksController.getByShareId);

export default router;
