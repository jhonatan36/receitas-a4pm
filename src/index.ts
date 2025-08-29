import 'reflect-metadata';
import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { AppDataSource } from './database/data-source';
import { errorHandler } from './middlewares/errorHandler';
import { routes } from './routes';
import { setupSwagger } from './swagger';

// Carrega as variáveis de ambiente
dotenv.config();

// Cria a aplicação Express
const app = express();

// Configurações do middleware
app.use(cors());
app.use(express.json());

// Configuração do Swagger
setupSwagger(app);

// Rotas da aplicação
app.use('/api', routes);

// Middleware de tratamento de erros
app.use(errorHandler);

// Porta do servidor
const PORT = process.env.PORT || 3000;

// Inicializa a conexão com o banco de dados e inicia o servidor
AppDataSource.initialize()
  .then(() => {
    console.log('Conexão com o banco de dados estabelecida com sucesso');
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Erro ao conectar com o banco de dados:', error);
  });