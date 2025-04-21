import { FastifyReply, FastifyRequest } from 'fastify';
import { Role } from '../types/roles';

export const roleGuard = (allowedRoles: Role[]) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const user = request.user;
      
      if (!user || !user.role) {
        throw new Error('Unauthorized');
      }

      if (!allowedRoles.includes(user.role as Role)) {
        throw new Error('Insufficient permissions');
      }
    } catch (error) {
      reply.code(403).send({
        message: error.message || 'Forbidden'
      });
    }
  };
}; 