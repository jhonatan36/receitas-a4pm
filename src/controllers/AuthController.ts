import { Request, Response } from 'express';
import { hash, compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { z } from 'zod';
import { AppDataSource } from '../database/data-source';
import { Usuario } from '../entities/Usuario';
import { AppError } from '../middlewares/errorHandler';

export class AuthController {
  async register(request: Request, response: Response) {
    // Validação dos dados de entrada
    const registerSchema = z.object({
      nome: z.string().min(1).max(100),
      login: z.string().min(3).max(100),
      senha: z.string().min(6).max(100),
    });

    const { nome, login, senha } = registerSchema.parse(request.body);

    const usuarioRepository = AppDataSource.getRepository(Usuario);

    // Verifica se o login já existe
    const loginExiste = await usuarioRepository.findOne({ where: { login } });

    if (loginExiste) {
      throw new AppError('Login já está em uso', 409);
    }

    // Criptografa a senha
    const senhaHash = await hash(senha, 8);

    // Cria o usuário
    const usuario = usuarioRepository.create({
      nome,
      login,
      senha: senhaHash,
      criadoEm: new Date(),
      alteradoEm: new Date(),
    });

    await usuarioRepository.save(usuario);

    // Remove a senha do objeto de retorno
    const { senha: _, ...usuarioSemSenha } = usuario;

    return response.status(201).json(usuarioSemSenha);
  }

  async login(request: Request, response: Response) {
    // Validação dos dados de entrada
    const loginSchema = z.object({
      login: z.string().min(1),
      senha: z.string().min(1),
    });

    const { login, senha } = loginSchema.parse(request.body);

    const usuarioRepository = AppDataSource.getRepository(Usuario);

    // Busca o usuário pelo login
    const usuario = await usuarioRepository.findOne({ where: { login } });

    if (!usuario) {
      throw new AppError('Credenciais inválidas', 401);
    }

    // Verifica se a senha está correta
    const senhaCorreta = await compare(senha, usuario.senha);

    if (!senhaCorreta) {
      throw new AppError('Credenciais inválidas', 401);
    }

    // Gera o token JWT
    const token = sign({ id: usuario.id }, process.env.JWT_SECRET as string, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    // Remove a senha do objeto de retorno
    const { senha: _, ...usuarioSemSenha } = usuario;

    return response.json({
      usuario: usuarioSemSenha,
      token,
    });
  }
}