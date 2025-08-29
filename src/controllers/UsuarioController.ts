import { Request, Response } from 'express';
import { hash } from 'bcryptjs';
import { z } from 'zod';
import { AppDataSource } from '../database/data-source';
import { Usuario } from '../entities/Usuario';
import { AppError } from '../middlewares/errorHandler';

export class UsuarioController {
  async perfil(request: Request, response: Response) {
    const usuarioId = request.user?.id;

    if (!usuarioId) {
      throw new AppError('Usuário não autenticado', 401);
    }

    const usuarioRepository = AppDataSource.getRepository(Usuario);
    const usuario = await usuarioRepository.findOne({ where: { id: usuarioId } });

    if (!usuario) {
      throw new AppError('Usuário não encontrado', 404);
    }

    // Remove a senha do objeto de retorno
    const { senha, ...usuarioSemSenha } = usuario;

    return response.json(usuarioSemSenha);
  }

  async atualizar(request: Request, response: Response) {
    const usuarioId = request.user?.id;

    if (!usuarioId) {
      throw new AppError('Usuário não autenticado', 401);
    }

    // Validação dos dados de entrada
    const atualizarSchema = z.object({
      nome: z.string().min(1).max(100).optional(),
      senha: z.string().min(6).max(100).optional(),
    });

    const { nome, senha } = atualizarSchema.parse(request.body);

    const usuarioRepository = AppDataSource.getRepository(Usuario);
    const usuario = await usuarioRepository.findOne({ where: { id: usuarioId } });

    if (!usuario) {
      throw new AppError('Usuário não encontrado', 404);
    }

    // Atualiza os dados do usuário
    if (nome) {
      usuario.nome = nome;
    }

    if (senha) {
      usuario.senha = await hash(senha, 8);
    }

    usuario.alteradoEm = new Date();

    await usuarioRepository.save(usuario);

    // Remove a senha do objeto de retorno
    const { senha: _, ...usuarioSemSenha } = usuario;

    return response.json(usuarioSemSenha);
  }
}