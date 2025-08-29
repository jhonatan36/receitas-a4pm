import { Request, Response } from 'express';
import { AppDataSource } from '../database/data-source';
import { Categoria } from '../entities/Categoria';
import { AppError } from '../middlewares/errorHandler';

export class CategoriaController {
  async listar(request: Request, response: Response) {
    const categoriaRepository = AppDataSource.getRepository(Categoria);
    const categorias = await categoriaRepository.find();

    return response.json(categorias);
  }

  async obterPorId(request: Request, response: Response) {
    const { id } = request.params;
    const categoriaId = Number(id);

    if (isNaN(categoriaId)) {
      throw new AppError('ID inválido', 400);
    }

    const categoriaRepository = AppDataSource.getRepository(Categoria);
    const categoria = await categoriaRepository.findOne({ where: { id: categoriaId } });

    if (!categoria) {
      throw new AppError('Categoria não encontrada', 404);
    }

    return response.json(categoria);
  }
}