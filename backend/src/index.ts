import Fastify, { FastifyInstance } from 'fastify';
import dotenv from 'dotenv';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import multipart from '@fastify/multipart';
import staticPlugin from '@fastify/static';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { dbPlugin } from './config/database';
import authRoutes from './routes/auth.routes';
import authPlugin from './plugins/auth';
import path from 'path';

dotenv.config();

const server: FastifyInstance = Fastify({
  logger: true,
}).withTypeProvider<TypeBoxTypeProvider>();

// Register plugins
async function registerPlugins() {
  // Core plugins
  await server.register(cors, {
    origin: true,
    credentials: true,
  });

  await server.register(jwt, {
    secret: process.env.JWT_SECRET!,
  });

  await server.register(multipart, {
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB
    }
  });

  // Static file serving for uploads
  await server.register(staticPlugin, {
    root: path.join(__dirname, '../uploads'),
    prefix: '/uploads/',
  });

  // Database plugin
  await server.register(dbPlugin);

  // Auth plugin
  await server.register(authPlugin);

  // Routes
  await server.register(authRoutes, { prefix: '/api/auth' });
}

// Health check route
server.get('/health', async () => {
  return { status: 'ok' };
});

const start = async () => {
  try {
    await registerPlugins();
    
    await server.listen({ 
      port: parseInt(process.env.PORT || '3000'),
      host: '0.0.0.0'
    });
    
    console.log(`Server is running on port ${process.env.PORT}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start(); 