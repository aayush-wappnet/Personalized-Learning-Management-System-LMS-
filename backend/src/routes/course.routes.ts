import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { CourseController } from '../controllers/course.controller';
import { CourseSchema } from '../schemas/course.schema';
import { Role } from '../types/roles';
import { roleGuard } from '../middlewares/roleGuard';
import { Type } from '@sinclair/typebox'; // Add this import

// Define route-specific generics
interface CreateRoute {
  Body: any; // Disable strict body typing for multipart
}
interface AddModuleRoute {
  Params: { id: string };
  Body: typeof CourseSchema['addModule']['body'];
}
interface GetByIdRoute {
  Params: { id: string };
}
interface UpdateRoute {
  Params: { id: string };
  Body: any; // Disable strict body typing for multipart
}
interface DeleteRoute {
  Params: { id: string };
}
interface ApproveRoute {
  Params: { id: string };
}
interface EnrollRoute {
  Params: { id: string };
}
interface UpdateProgressRoute {
  Params: { id: string };
  Body: typeof CourseSchema['updateProgress']['body'];
}

export default async function courseRoutes(fastify: FastifyInstance) {
  const courseController = new CourseController();

  fastify.post<CreateRoute>('/courses', {
    preHandler: roleGuard([Role.INSTRUCTOR]),
    config: {
      rawBody: true // Disable strict body parsing
    },
    schema: {
      ...CourseSchema.create,
      body: Type.Any() // Allow any body for multipart
    }
  }, courseController.createCourse.bind(courseController));

  fastify.post<AddModuleRoute>('/courses/:id/modules', {
    preHandler: roleGuard([Role.INSTRUCTOR]),
    schema: CourseSchema.addModule
  }, courseController.addModule.bind(courseController));

  fastify.get<GetByIdRoute>('/courses/:id', {
    preHandler: fastify.authenticate,
    schema: CourseSchema.getById
  }, courseController.getCourseById.bind(courseController));

  fastify.put<UpdateRoute>('/courses/:id', {
    preHandler: roleGuard([Role.INSTRUCTOR]),
    config: {
      rawBody: true // Disable strict body parsing
    },
    schema: {
      ...CourseSchema.update,
      body: Type.Any() // Allow any body for multipart
    }
  }, courseController.updateCourse.bind(courseController));

  fastify.delete<DeleteRoute>('/courses/:id', {
    preHandler: roleGuard([Role.INSTRUCTOR]),
    schema: CourseSchema.delete
  }, courseController.deleteCourse.bind(courseController));

  fastify.get<GetByIdRoute>('/courses', {
    preHandler: fastify.authenticate,
    schema: CourseSchema.getAll
  }, courseController.getAllCourses.bind(courseController));

  fastify.post<ApproveRoute>('/courses/:id/approve', {
    preHandler: roleGuard([Role.ADMIN]),
    schema: CourseSchema.approve
  }, courseController.approveCourse.bind(courseController));

  fastify.post<EnrollRoute>('/courses/:id/enroll', {
    preHandler: roleGuard([Role.STUDENT]),
    schema: CourseSchema.enroll
  }, courseController.enrollCourse.bind(courseController));

  fastify.put<UpdateProgressRoute>('/enrollments/:id/progress', {
    preHandler: roleGuard([Role.STUDENT]),
    schema: CourseSchema.updateProgress
  }, courseController.updateProgress.bind(courseController));
}