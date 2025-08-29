# Sistema de Gerenciamento de Receitas

Este é um sistema de gerenciamento de receitas desenvolvido em Node.js com TypeScript, utilizando MySQL como banco de dados.

## Funcionalidades

- Cadastro de usuários no sistema
- Autenticação de usuários (login)
- Encerramento de sessão (logoff)
- Cadastro de receitas por usuário
- Consulta de receitas cadastradas pelo usuário
- Atualização de receitas existentes
- Remoção de receitas
- Geração de relatório (impressão) de receitas em PDF

## Requisitos

- Node.js (versão 14 ou superior)
- MySQL (versão 8.0 ou superior)
- Docker e Docker Compose (opcional, para execução em contêiner)

## Configuração

### Instalação de dependências

```bash
npm install
```

### Configuração do banco de dados

O script SQL para criação do banco de dados está disponível em `banco/script.sql`. Você pode executá-lo diretamente no seu servidor MySQL ou utilizar o Docker Compose conforme descrito abaixo.

### Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```
# Configurações do servidor
PORT=3000
NODE_ENV=development

# Configurações do banco de dados
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=root
DB_DATABASE=teste_receitas_rg_sistemas

# Configurações de autenticação
JWT_SECRET=sua_chave_secreta_aqui
JWT_EXPIRES_IN=1d
```

## Execução

### Desenvolvimento

```bash
npm run dev
```

### Produção

```bash
npm run build
npm start
```

### Docker

```bash
docker-compose up -d
```

## Documentação da API

A documentação da API está disponível através do Swagger UI em:

```
http://localhost:3000/api-docs
```

## Estrutura do Projeto

```
├── src/
│   ├── controllers/     # Controladores da aplicação
│   ├── database/        # Configuração do banco de dados
│   ├── entities/        # Entidades do TypeORM
│   ├── middlewares/     # Middlewares da aplicação
│   ├── routes/          # Rotas da API
│   ├── index.ts         # Ponto de entrada da aplicação
│   └── swagger.ts       # Configuração do Swagger
├── banco/               # Scripts do banco de dados
├── .env                 # Variáveis de ambiente
├── docker-compose.yml   # Configuração do Docker Compose
├── Dockerfile           # Configuração do Docker
└── package.json         # Dependências do projeto
```

## Endpoints da API

### Autenticação

- `POST /api/auth/register` - Registra um novo usuário
- `POST /api/auth/login` - Autentica um usuário

### Usuários

- `GET /api/usuarios/perfil` - Obtém o perfil do usuário logado
- `PUT /api/usuarios/atualizar` - Atualiza os dados do usuário logado

### Receitas

- `GET /api/receitas` - Lista todas as receitas do usuário logado
- `GET /api/receitas/:id` - Obtém uma receita específica
- `POST /api/receitas` - Cria uma nova receita
- `PUT /api/receitas/:id` - Atualiza uma receita existente
- `DELETE /api/receitas/:id` - Remove uma receita
- `GET /api/receitas/:id/relatorio` - Gera um relatório PDF da receita

### Categorias

- `GET /api/categorias` - Lista todas as categorias disponíveis
- `GET /api/categorias/:id` - Obtém uma categoria específica