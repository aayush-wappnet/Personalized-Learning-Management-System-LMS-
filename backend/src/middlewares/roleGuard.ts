import { FastifyReply, FastifyRequest } from 'fastify';
import { Role } from '../types/roles';

// Extend FastifyRequest type to include user with role
declare module 'fastify' {
  export interface FastifyRequest {
    user?: {
      id: number;
      email: string;
      role: Role;
    } | any; // Merge with @fastify/jwt definition
  }
}

export const roleGuard = (allowedRoles: Role[]) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const user = request.user;
      if (!user || typeof user !== 'object' || !user.role) {
        throw new Error('Unauthorized');
      }

      if (!allowedRoles.includes(user.role)) {
        throw new Error('Insufficient permissions');
      }
    } catch (error: any) {
      reply.code(403).send({
        message: error.message || 'Forbidden'
      });
    }
  };
};