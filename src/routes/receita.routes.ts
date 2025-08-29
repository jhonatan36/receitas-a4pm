import { Router } from 'express';
import { ReceitaController } from '../controllers/ReceitaController';
import { authMiddleware } from '../middlewares/authMiddleware';

const receitaRoutes = Router();
const receitaController = new ReceitaController();

// Todas as rotas de receita requerem autenticação
receitaRoutes.use(authMiddleware);

/**
 * @swagger
 * /api/receitas:
 *   get:
 *     summary: Lista todas as receitas do usuário logado
 *     tags: [Receitas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de receitas
 *       401:
 *         description: Não autorizado
 */
receitaRoutes.get('/', receitaController.listar);

/**
 * @swagger
 * /api/receitas/{id}:
 *   get:
 *     summary: Obtém uma receita específica
 *     tags: [Receitas]
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
 *         description: Detalhes da receita
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Receita não encontrada
 */
receitaRoutes.get('/:id', receitaController.obterPorId);

/**
 * @swagger
 * /api/receitas:
 *   post:
 *     summary: Cria uma nova receita
 *     tags: [Receitas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - modoPreparo
 *             properties:
 *               nome:
 *                 type: string
 *               idCategoria:
 *                 type: integer
 *               tempoPreparoMinutos:
 *                 type: integer
 *               porcoes:
 *                 type: integer
 *               modoPreparo:
 *                 type: string
 *               ingredientes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Receita criada com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 */
receitaRoutes.post('/', receitaController.criar);

/**
 * @swagger
 * /api/receitas/{id}:
 *   put:
 *     summary: Atualiza uma receita existente
 *     tags: [Receitas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               idCategoria:
 *                 type: integer
 *               tempoPreparoMinutos:
 *                 type: integer
 *               porcoes:
 *                 type: integer
 *               modoPreparo:
 *                 type: string
 *               ingredientes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Receita atualizada com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Receita não encontrada
 */
receitaRoutes.put('/:id', receitaController.atualizar);

/**
 * @swagger
 * /api/receitas/{id}:
 *   delete:
 *     summary: Remove uma receita
 *     tags: [Receitas]
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
 *         description: Receita removida com sucesso
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Receita não encontrada
 */
receitaRoutes.delete('/:id', receitaController.remover);

/**
 * @swagger
 * /api/receitas/{id}/relatorio:
 *   get:
 *     summary: Gera um relatório PDF da receita
 *     tags: [Receitas]
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
 *         description: Relatório PDF gerado com sucesso
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Receita não encontrada
 */
receitaRoutes.get('/:id/relatorio', receitaController.gerarRelatorio);

export { receitaRoutes };