import { FastifyReply, FastifyRequest } from 'fastify';
import { AuthService } from '../services/auth.service';
import { Role } from '../types/roles';
import { User } from '../entities/User';

// Define proper types for request bodies
export interface RegisterBody {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: Role;
}

export interface LoginBody {
  email: string;
  password: string;
}

// Define response types
interface AuthResponse {
  token: string;
}

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  async register(
    request: FastifyRequest<{ Body: RegisterBody }>,
    reply: FastifyReply
  ): Promise<FastifyReply> {
    try {
      // Validate role if provided
      if (request.body.role && !Object.values(Role).includes(request.body.role)) {
        return reply.code(400).send({
          message: 'Invalid role provided'
        });
      }

      const user = await this.authService.register(request.body);
      const token = await reply.jwtSign({ 
        id: user.id,
        email: user.email,
        role: user.role 
      }, {
        expiresIn: process.env.JWT_EXPIRES_IN || '1d'
      });

      return reply.code(201).send({ token });
    } catch (error: any) {
      // Handle specific errors
      if (error.code === '23505') { // PostgreSQL unique violation error
        return reply.code(400).send({
          message: 'Email already exists'
        });
      }

      return reply.code(error.statusCode || 500).send({
        message: error.message || 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }

  async login(
    request: FastifyRequest<{ Body: LoginBody }>,
    reply: FastifyReply
  ): Promise<FastifyReply> {
    try {
      const { email, password } = request.body;
      const user = await this.authService.validateUser(email, password);
      const token = await reply.jwtSign({ 
        id: user.id,
        email: user.email,
        role: user.role 
      }, {
        expiresIn: process.env.JWT_EXPIRES_IN || '1d'
      });

      return reply.send({ token });
    } catch (error: any) {
      return reply.code(error.statusCode || 500).send({
        message: error.message || 'Invalid credentials',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }

  // Add method to get current user
  async getCurrentUser(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<FastifyReply> {
    try {
      const user = await this.authService.findUserById(request.user.id);
      return reply.send({ user: user.toJSON() });
    } catch (error: any) {
      return reply.code(error.statusCode || 500).send({
        message: error.message || 'Internal Server Error'
      });
    }
  }
} 