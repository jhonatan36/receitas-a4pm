import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { QueryFailedError } from 'typeorm';

export class AppError extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}

export function errorHandler(
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction
) {
  console.error(error);

  // Erro personalizado da aplicação
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: 'error',
      message: error.message,
    });
  }

  // Erro de validação do Zod
  if (error instanceof ZodError) {
    return response.status(400).json({
      status: 'error',
      message: 'Erro de validação',
      errors: error.format(),
    });
  }

  // Erro de consulta do banco de dados
  if (error instanceof QueryFailedError) {
    return response.status(500).json({
      status: 'error',
      message: 'Erro no banco de dados',
    });
  }

  // Erro genérico
  return response.status(500).json({
    status: 'error',
    message: 'Erro interno do servidor',
  });
}