import { AppDataSource } from '../config/database';
import { User } from '../entities/User';
import { compare } from 'bcrypt';
import { FastifyError } from 'fastify';
import { RegisterBody } from '../controllers/auth.controller';
import { FindOptionsWhere } from 'typeorm';

export class AuthService {
  private userRepository = AppDataSource.getRepository(User);

  async register(userData: RegisterBody): Promise<User> {
    try {
      const existingUser = await this.userRepository.findOne({
        where: { email: userData.email } as FindOptionsWhere<User>
      });

      if (existingUser) {
        throw { statusCode: 400, message: 'User already exists', code: '23505' } as FastifyError;
      }

      const user = this.userRepository.create(userData);
      return await this.userRepository.save(user);
    } catch (error) {
      throw error;
    }
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email } as FindOptionsWhere<User>
    });

    if (!user) {
      throw { statusCode: 401, message: 'Invalid credentials' } as FastifyError;
    }

    const isValidPassword = await compare(password, user.password);
    if (!isValidPassword) {
      throw { statusCode: 401, message: 'Invalid credentials' } as FastifyError;
    }

    return user;
  }

  async findUserById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id } as FindOptionsWhere<User>
    });

    if (!user) {
      throw { statusCode: 404, message: 'User not found' } as FastifyError;
    }

    return user;
  }
}