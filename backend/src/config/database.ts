import { DataSource } from 'typeorm';
import fastifyPlugin from 'fastify-plugin';
import { FastifyInstance } from 'fastify';
import dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: process.env.NODE_ENV === 'development', // Be careful with this in production
  logging: process.env.NODE_ENV === 'development',
  entities: [process.env.NODE_ENV === 'production' ? 'dist/entities/**/*.js' : 'src/entities/**/*.ts'],
  migrations: [process.env.NODE_ENV === 'production' ? 'dist/migrations/**/*.js' : 'src/migrations/**/*.ts'],
  subscribers: [process.env.NODE_ENV === 'production' ? 'dist/subscribers/**/*.js' : 'src/subscribers/**/*.ts'],
});

// Create a Fastify plugin for database connection
export const dbPlugin = fastifyPlugin(async (fastify: FastifyInstance) => {
  try {
    await AppDataSource.initialize();
    fastify.log.info('Database connection established');
    
    // Decorate Fastify instance with DataSource
    fastify.decorate('db', AppDataSource);
    
    // Handle graceful shutdown
    fastify.addHook('onClose', async (instance) => {
      await AppDataSource.destroy();
      instance.log.info('Database connection closed');
    });
  } catch (error) {
    fastify.log.error('Error connecting to database:', error);
    throw error;
  }
});

// Add TypeScript type declaration for Fastify
declare module 'fastify' {
  interface FastifyInstance {
    db: DataSource;
  }
} 