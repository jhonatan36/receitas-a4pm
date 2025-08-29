import { Router } from 'express';
import { UsuarioController } from '../controllers/UsuarioController';
import { authMiddleware } from '../middlewares/authMiddleware';

const usuarioRoutes = Router();
const usuarioController = new UsuarioController();

// Todas as rotas de usuário requerem autenticação
usuarioRoutes.use(authMiddleware);

/**
 * @swagger
 * /api/usuarios/perfil:
 *   get:
 *     summary: Obtém o perfil do usuário logado
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil do usuário
 *       401:
 *         description: Não autorizado
 */
usuarioRoutes.get('/perfil', usuarioController.perfil);

/**
 * @swagger
 * /api/usuarios/atualizar:
 *   put:
 *     summary: Atualiza os dados do usuário logado
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               senha:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 */
usuarioRoutes.put('/atualizar', usuarioController.atualizar);

export { usuarioRoutes };