import { FastifyInstance } from 'fastify';
import { AuthController } from '../controllers/auth.controller';
import { loginSchema, registerSchema } from '../schemas/auth.schema';

// Extend FastifyInstance type to include authenticate
declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

export default async function authRoutes(fastify: FastifyInstance) {
  const authController = new AuthController();

  fastify.post('/register', { schema: registerSchema }, authController.register.bind(authController));

  fastify.post('/login', { schema: loginSchema }, authController.login.bind(authController));

  fastify.get('/me', { preHandler: fastify.authenticate }, authController.getCurrentUser.bind(authController));

  fastify.post('/logout', { preHandler: fastify.authenticate }, authController.logout.bind(authController));
}