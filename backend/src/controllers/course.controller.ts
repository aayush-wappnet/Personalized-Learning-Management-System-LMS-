import { FastifyReply, FastifyRequest } from 'fastify';
import { CourseService } from '../services/course.service';
import { Course } from '../entities/Course';
import { Module } from '../entities/Module';
import { CourseSchema } from '../schemas/course.schema';
import { Multipart } from '@fastify/multipart';


export class CourseController {
  private courseService: CourseService;

  constructor() {
    this.courseService = new CourseService();
  }

  async createCourse(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<FastifyReply> {
    try {
      let title: string | undefined;
      let description: string | undefined;
      let isActive: boolean | undefined;
      let thumbnail: Buffer | undefined;

      if (request.isMultipart()) {
        const parts = request.parts();
        for await (const part of parts as AsyncIterable<Multipart>) {
          if (part.type === 'field') {
            if (part.fieldname === 'title') title = part.value as string;
            if (part.fieldname === 'description') description = part.value as string;
            if (part.fieldname === 'isActive') isActive = part.value === 'true';
          } else if (part.type === 'file' && part.fieldname === 'thumbnail') {
            const buffers: Buffer[] = [];
            for await (const chunk of part.file) buffers.push(chunk);
            thumbnail = Buffer.concat(buffers);
          }
        }
      } else {
        // Type assertion for non-multipart body
        const body = request.body as Partial<{ title: string; description: string; isActive: boolean }>;
        title = body.title;
        description = body.description;
        isActive = body.isActive;
      }

      if (!title || !description) {
        throw { statusCode: 400, message: 'Title and description are required' } as any;
      }

      const courseData: Partial<Course> = { title, description, isActive };
      const course = await this.courseService.createCourse(courseData, Number(request.user!.id), thumbnail);
      return reply.code(201).send(course);
    } catch (error: any) {
      return reply.code(error.statusCode || 500).send({ message: error.message || 'Internal Server Error' });
    }
  }

  async addModule(
    request: FastifyRequest<{ Params: { id: string }; Body: typeof CourseSchema['addModule']['body'] }>,
    reply: FastifyReply
  ): Promise<FastifyReply> {
    try {
      const module = await this.courseService.addModule(Number(request.params.id), request.body as Partial<Module>);
      return reply.code(201).send(module);
    } catch (error: any) {
      return reply.code(error.statusCode || 500).send({ message: error.message || 'Internal Server Error' });
    }
  }

  async getCourseById(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ): Promise<FastifyReply> {
    try {
      const course = await this.courseService.getCourseById(Number(request.params.id));
      return reply.send(course);
    } catch (error: any) {
      return reply.code(error.statusCode || 500).send({ message: error.message || 'Internal Server Error' });
    }
  }

  async updateCourse(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ): Promise<FastifyReply> {
    try {
      let title: string | undefined;
      let description: string | undefined;
      let isActive: boolean | undefined;
      let thumbnail: Buffer | undefined;

      if (request.isMultipart()) {
        const parts = request.parts();
        for await (const part of parts as AsyncIterable<Multipart>) {
          if (part.type === 'field') {
            if (part.fieldname === 'title') title = part.value as string;
            if (part.fieldname === 'description') description = part.value as string;
            if (part.fieldname === 'isActive') isActive = part.value === 'true';
          } else if (part.type === 'file' && part.fieldname === 'thumbnail') {
            const buffers: Buffer[] = [];
            for await (const chunk of part.file) buffers.push(chunk);
            thumbnail = Buffer.concat(buffers);
          }
        }
      } else {
        // Type assertion for non-multipart body
        const body = request.body as Partial<{ title: string; description: string; isActive: boolean }>;
        title = body.title;
        description = body.description;
        isActive = body.isActive;
      }

      const courseData: Partial<Course> = { title, description, isActive };
      const course = await this.courseService.updateCourse(Number(request.params.id), courseData, thumbnail);
      return reply.send(course);
    } catch (error: any) {
      return reply.code(error.statusCode || 500).send({ message: error.message || 'Internal Server Error' });
    }
  }

  async deleteCourse(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ): Promise<FastifyReply> {
    try {
      await this.courseService.deleteCourse(Number(request.params.id));
      return reply.code(204).send();
    } catch (error: any) {
      return reply.code(error.statusCode || 500).send({ message: error.message || 'Internal Server Error' });
    }
  }

  async getAllCourses(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<FastifyReply> {
    try {
      const courses = await this.courseService.getAllCourses();
      return reply.send(courses);
    } catch (error: any) {
      return reply.code(error.statusCode || 500).send({ message: error.message || 'Internal Server Error' });
    }
  }

  async approveCourse(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ): Promise<FastifyReply> {
    try {
      const course = await this.courseService.approveCourse(Number(request.params.id), Number(request.user!.id));
      return reply.send(course);
    } catch (error: any) {
      return reply.code(error.statusCode || 500).send({ message: error.message || 'Internal Server Error' });
    }
  }

  async enrollCourse(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ): Promise<FastifyReply> {
    try {
      const enrollment = await this.courseService.enrollStudent(Number(request.params.id), Number(request.user!.id));
      return reply.code(201).send(enrollment);
    } catch (error: any) {
      return reply.code(error.statusCode || 500).send({ message: error.message || 'Internal Server Error' });
    }
  }

  async updateProgress(
    request: FastifyRequest<{ Params: { id: string }; Body: typeof CourseSchema['updateProgress']['body'] }>,
    reply: FastifyReply
  ): Promise<FastifyReply> {
    try {
      const enrollment = await this.courseService.updateProgress(Number(request.params.id), request.body.progress);
      return reply.send(enrollment);
    } catch (error: any) {
      return reply.code(error.statusCode || 500).send({ message: error.message || 'Internal Server Error' });
    }
  }
}