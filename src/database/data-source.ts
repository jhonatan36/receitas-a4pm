import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { Usuario } from '../entities/Usuario';
import { Categoria } from '../entities/Categoria';
import { Receita } from '../entities/Receita';

// Carrega as variáveis de ambiente
dotenv.config();

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: false, // Não sincroniza automaticamente pois já temos o esquema definido
  logging: process.env.NODE_ENV === 'development',
  entities: [Usuario, Categoria, Receita],
  subscribers: [],
  migrations: [],
});