import { FastifyInstance, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';
import { User } from '../entities/User';

declare module 'fastify' {
  interface FastifyRequest {
    user?: User;
  }
}

export default fp(async (fastify: FastifyInstance) => {
  fastify.decorate('authenticate', async (request: FastifyRequest) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      throw { statusCode: 401, message: 'Unauthorized' };
    }
  });
}); 