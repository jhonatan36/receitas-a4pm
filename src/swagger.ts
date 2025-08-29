import { Express } from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

export function setupSwagger(app: Express) {
  const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'API de Receitas',
        version: '1.0.0',
        description: 'API para gerenciamento de receitas culinárias',
      },
      servers: [
        {
          url: `http://localhost:${process.env.PORT || 3000}/api`,
          description: 'Servidor de desenvolvimento',
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
      tags: [
        {
          name: 'Autenticação',
          description: 'Operações relacionadas à autenticação',
        },
        {
          name: 'Usuários',
          description: 'Operações relacionadas aos usuários',
        },
        {
          name: 'Receitas',
          description: 'Operações relacionadas às receitas',
        },
        {
          name: 'Categorias',
          description: 'Operações relacionadas às categorias',
        },
      ],
    },
    apis: ['./src/routes/*.ts'],
  };

  const specs = swaggerJsdoc(options);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
}