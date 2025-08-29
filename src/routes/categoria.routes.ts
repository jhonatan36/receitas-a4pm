import { Router } from 'express';
import { CategoriaController } from '../controllers/CategoriaController';
import { authMiddleware } from '../middlewares/authMiddleware';

const categoriaRoutes = Router();
const categoriaController = new CategoriaController();

// Todas as rotas de categoria requerem autenticação
categoriaRoutes.use(authMiddleware);

/**
 * @swagger
 * /api/categorias:
 *   get:
 *     summary: Lista todas as categorias disponíveis
 *     tags: [Categorias]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de categorias
 *       401:
 *         description: Não autorizado
 */
categoriaRoutes.get('/', categoriaController.listar);

/**
 * @swagger
 * /api/categorias/{id}:
 *   get:
 *     summary: Obtém uma categoria específica
 *     tags: [Categorias]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalhes da categoria
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Categoria não encontrada
 */
categoriaRoutes.get('/:id', categoriaController.obterPorId);

export { categoriaRoutes };