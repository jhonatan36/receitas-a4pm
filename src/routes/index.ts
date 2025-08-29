import { Router } from 'express';
import { usuarioRoutes } from './usuario.routes';
import { authRoutes } from './auth.routes';
import { receitaRoutes } from './receita.routes';
import { categoriaRoutes } from './categoria.routes';

const routes = Router();

// Rotas de autenticação
routes.use('/auth', authRoutes);

// Rotas de usuários
routes.use('/usuarios', usuarioRoutes);

// Rotas de receitas
routes.use('/receitas', receitaRoutes);

// Rotas de categorias
routes.use('/categorias', categoriaRoutes);

export { routes };