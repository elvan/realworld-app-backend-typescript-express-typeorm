import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config();

// TypeORM data source configuration
export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'realworld',
  synchronize: process.env.NODE_ENV === 'development', // Auto-sync in dev only
  logging: process.env.NODE_ENV === 'development',
  entities: [path.join(__dirname, 'entities/**/*.{ts,js}')],
  migrations: [path.join(__dirname, 'migrations/**/*.{ts,js}')],
  subscribers: [path.join(__dirname, 'subscribers/**/*.{ts,js}')],
  cache: true,
});
