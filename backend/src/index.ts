import Fastify, { FastifyInstance } from 'fastify';
import dotenv from 'dotenv';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import staticPlugin from '@fastify/static';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { dbPlugin } from './config/database';
import authRoutes from './routes/auth.routes';
import authPlugin from './plugins/auth';
import courseRoutes from './routes/course.routes';
import uploadPlugin from './plugins/upload';
import path from 'path';

dotenv.config();

const server: FastifyInstance = Fastify({
  logger: true,
}).withTypeProvider<TypeBoxTypeProvider>();

// Register plugins
async function registerPlugins() {
  await server.register(cors, {
    origin: true,
    credentials: true,
  });

  await server.register(jwt, {
    secret: process.env.JWT_SECRET!, // Ensure this is set in .env
    decode: { complete: true }, // Ensure token decoding includes payload
    verify: { extractToken: (req) => req.headers.authorization?.replace('Bearer ', '') } // Extract token
  });

  await server.register(staticPlugin, {
    root: path.join(__dirname, '../uploads'),
    prefix: '/uploads/',
  });

  await server.register(dbPlugin);

  await server.register(authPlugin);

  await server.register(uploadPlugin);

  await server.register(authRoutes, { prefix: '/api/auth' });
  await server.register(courseRoutes, { prefix: '/api' });

  // Debug route to check user
  server.get('/debug', { preHandler: server.authenticate }, async (request) => {
    server.log.info('Debug User:', request.user);
    return { user: request.user };
  });
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