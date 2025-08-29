import { Request, Response } from 'express';
import { z } from 'zod';
import PDFDocument from 'pdfkit';
import { AppDataSource } from '../database/data-source';
import { Receita } from '../entities/Receita';
import { Categoria } from '../entities/Categoria';
import { AppError } from '../middlewares/errorHandler';

export class ReceitaController {
  async listar(request: Request, response: Response) {
    const usuarioId = request.user?.id;

    if (!usuarioId) {
      throw new AppError('Usuário não autenticado', 401);
    }

    const receitaRepository = AppDataSource.getRepository(Receita);
    const receitas = await receitaRepository.find({
      where: { idUsuario: usuarioId },
      relations: ['categoria'],
    });

    return response.json(receitas);
  }

  async obterPorId(request: Request, response: Response) {
    const usuarioId = request.user?.id;
    const { id } = request.params;
    const receitaId = Number(id);

    if (!usuarioId) {
      throw new AppError('Usuário não autenticado', 401);
    }

    if (isNaN(receitaId)) {
      throw new AppError('ID inválido', 400);
    }

    const receitaRepository = AppDataSource.getRepository(Receita);
    const receita = await receitaRepository.findOne({
      where: { id: receitaId, idUsuario: usuarioId },
      relations: ['categoria'],
    });

    if (!receita) {
      throw new AppError('Receita não encontrada', 404);
    }

    return response.json(receita);
  }

  async criar(request: Request, response: Response) {
    const usuarioId = request.user?.id;

    if (!usuarioId) {
      throw new AppError('Usuário não autenticado', 401);
    }

    // Validação dos dados de entrada
    const criarReceitaSchema = z.object({
      nome: z.string().min(1).max(45),
      idCategoria: z.number().int().positive().optional(),
      tempoPreparoMinutos: z.number().int().positive().optional(),
      porcoes: z.number().int().positive().optional(),
      modoPreparo: z.string().min(1),
      ingredientes: z.string().optional(),
    });

    const {
      nome,
      idCategoria,
      tempoPreparoMinutos,
      porcoes,
      modoPreparo,
      ingredientes,
    } = criarReceitaSchema.parse(request.body);

    // Verifica se a categoria existe, se fornecida
    if (idCategoria) {
      const categoriaRepository = AppDataSource.getRepository(Categoria);
      const categoriaExiste = await categoriaRepository.findOne({
        where: { id: idCategoria },
      });

      if (!categoriaExiste) {
        throw new AppError('Categoria não encontrada', 404);
      }
    }

    const receitaRepository = AppDataSource.getRepository(Receita);

    const receita = receitaRepository.create({
      nome,
      idUsuario: usuarioId,
      idCategoria: idCategoria || null,
      tempoPreparoMinutos,
      porcoes,
      modoPreparo,
      ingredientes,
      criadoEm: new Date(),
      alteradoEm: new Date(),
    });

    await receitaRepository.save(receita);

    return response.status(201).json(receita);
  }

  async atualizar(request: Request, response: Response) {
    const usuarioId = request.user?.id;
    const { id } = request.params;
    const receitaId = Number(id);

    if (!usuarioId) {
      throw new AppError('Usuário não autenticado', 401);
    }

    if (isNaN(receitaId)) {
      throw new AppError('ID inválido', 400);
    }

    // Validação dos dados de entrada
    const atualizarReceitaSchema = z.object({
      nome: z.string().min(1).max(45).optional(),
      idCategoria: z.number().int().positive().nullable().optional(),
      tempoPreparoMinutos: z.number().int().positive().optional(),
      porcoes: z.number().int().positive().optional(),
      modoPreparo: z.string().min(1).optional(),
      ingredientes: z.string().optional(),
    });

    const dados = atualizarReceitaSchema.parse(request.body);

    const receitaRepository = AppDataSource.getRepository(Receita);
    const receita = await receitaRepository.findOne({
      where: { id: receitaId, idUsuario: usuarioId },
    });

    if (!receita) {
      throw new AppError('Receita não encontrada', 404);
    }

    // Verifica se a categoria existe, se fornecida
    if (dados.idCategoria !== undefined) {
      if (dados.idCategoria !== null) {
        const categoriaRepository = AppDataSource.getRepository(Categoria);
        const categoriaExiste = await categoriaRepository.findOne({
          where: { id: dados.idCategoria },
        });

        if (!categoriaExiste) {
          throw new AppError('Categoria não encontrada', 404);
        }
      }
    }

    // Atualiza os dados da receita
    receitaRepository.merge(receita, {
      ...dados,
      alteradoEm: new Date(),
    });

    await receitaRepository.save(receita);

    return response.json(receita);
  }

  async remover(request: Request, response: Response) {
    const usuarioId = request.user?.id;
    const { id } = request.params;
    const receitaId = Number(id);

    if (!usuarioId) {
      throw new AppError('Usuário não autenticado', 401);
    }

    if (isNaN(receitaId)) {
      throw new AppError('ID inválido', 400);
    }

    const receitaRepository = AppDataSource.getRepository(Receita);
    const receita = await receitaRepository.findOne({
      where: { id: receitaId, idUsuario: usuarioId },
    });

    if (!receita) {
      throw new AppError('Receita não encontrada', 404);
    }

    await receitaRepository.remove(receita);

    return response.json({ message: 'Receita removida com sucesso' });
  }

  async gerarRelatorio(request: Request, response: Response) {
    const usuarioId = request.user?.id;
    const { id } = request.params;
    const receitaId = Number(id);

    if (!usuarioId) {
      throw new AppError('Usuário não autenticado', 401);
    }

    if (isNaN(receitaId)) {
      throw new AppError('ID inválido', 400);
    }

    const receitaRepository = AppDataSource.getRepository(Receita);
    const receita = await receitaRepository.findOne({
      where: { id: receitaId, idUsuario: usuarioId },
      relations: ['categoria', 'usuario'],
    });

    if (!receita) {
      throw new AppError('Receita não encontrada', 404);
    }

    // Cria um novo documento PDF
    const doc = new PDFDocument();
    
    // Define o cabeçalho do response
    response.setHeader('Content-Type', 'application/pdf');
    response.setHeader('Content-Disposition', `attachment; filename=receita-${receitaId}.pdf`);
    
    // Pipe o PDF para o response
    doc.pipe(response);
    
    // Adiciona o conteúdo ao PDF
    doc.fontSize(25).text(`Receita: ${receita.nome}`, { align: 'center' });
    doc.moveDown();
    
    if (receita.categoria) {
      doc.fontSize(14).text(`Categoria: ${receita.categoria.nome}`);
      doc.moveDown();
    }
    
    if (receita.tempoPreparoMinutos) {
      doc.fontSize(14).text(`Tempo de Preparo: ${receita.tempoPreparoMinutos} minutos`);
      doc.moveDown();
    }
    
    if (receita.porcoes) {
      doc.fontSize(14).text(`Porções: ${receita.porcoes}`);
      doc.moveDown();
    }
    
    doc.fontSize(16).text('Ingredientes:', { underline: true });
    doc.fontSize(12).text(receita.ingredientes || 'Não informado');
    doc.moveDown();
    
    doc.fontSize(16).text('Modo de Preparo:', { underline: true });
    doc.fontSize(12).text(receita.modoPreparo);
    doc.moveDown();
    
    doc.fontSize(10).text(`Criado em: ${receita.criadoEm.toLocaleDateString()}`);
    doc.fontSize(10).text(`Última atualização: ${receita.alteradoEm.toLocaleDateString()}`);
    
    // Finaliza o PDF
    doc.end();
  }
}