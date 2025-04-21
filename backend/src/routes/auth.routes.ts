import { FastifyInstance } from 'fastify';
import { AuthController } from '../controllers/auth.controller';
import { loginSchema, registerSchema } from '../schemas/auth.schema';

export default async function authRoutes(fastify: FastifyInstance) {
  const authController = new AuthController();

  fastify.post(
    '/register',
    { schema: registerSchema },
    authController.register.bind(authController)
  );

  fastify.post(
    '/login',
    { schema: loginSchema },
    authController.login.bind(authController)
  );
} 