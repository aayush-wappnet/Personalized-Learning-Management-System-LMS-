import { FastifyInstance, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';
import { User } from '../entities/User';

declare module 'fastify' {
  interface FastifyRequest {
    user?: { id: number; email: string; role: User['role'] };
  }
}

export default fp(async (fastify: FastifyInstance) => {
  fastify.decorate('authenticate', async (request: FastifyRequest) => {
    try {
      const decoded = await request.jwtVerify<{ id: number; email: string; role: User['role'] }>();
      request.user = decoded;
    } catch (err) {
      throw { statusCode: 401, message: 'Unauthorized' };
    }
  });
});