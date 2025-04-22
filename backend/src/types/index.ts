import { Role } from './roles';

declare module 'fastify' {
  export interface FastifyRequest {
    user?: (string | object | Buffer<ArrayBufferLike>) & {
      id?: number;
      email?: string;
      role?: Role;
    };
  }
}