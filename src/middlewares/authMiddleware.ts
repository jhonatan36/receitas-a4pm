import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { AppError } from './errorHandler';

interface TokenPayload {
  id: number;
  iat: number;
  exp: number;
}

export function authMiddleware(
  request: Request,
  response: Response,
  next: NextFunction
) {
  // Obtém o token do cabeçalho de autorização
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError('Token não fornecido', 401);
  }

  // Formato do token: Bearer <token>
  const [, token] = authHeader.split(' ');

  try {
    // Verifica se o token é válido
    const decoded = verify(token, process.env.JWT_SECRET as string) as TokenPayload;

    // Adiciona o ID do usuário à requisição
    request.user = {
      id: decoded.id,
    };

    return next();
  } catch (error) {
    throw new AppError('Token inválido', 401);
  }
}

// Estende o tipo Request do Express para incluir o usuário
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
      };
    }
  }
}