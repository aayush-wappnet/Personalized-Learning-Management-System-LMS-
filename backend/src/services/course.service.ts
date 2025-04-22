import { AppDataSource } from '../config/database';
import { Course } from '../entities/Course';
import { Module } from '../entities/Module';
import { User } from '../entities/User';
import { Enrollment } from '../entities/Enrollment';
import { FastifyError } from 'fastify';
import { FindOptionsWhere } from 'typeorm';
import { uploadToCloudinary } from '../config/cloudinary'; // Changed from '@/config/cloudinary'

export class CourseService {
  private courseRepository = AppDataSource.getRepository(Course);
  private moduleRepository = AppDataSource.getRepository(Module);
  private userRepository = AppDataSource.getRepository(User);
  private enrollmentRepository = AppDataSource.getRepository(Enrollment);

  async createCourse(courseData: Partial<Course>, instructorId: number, thumbnail?: Buffer): Promise<Course> {
    try {
      const instructor = await this.userRepository.findOne({ where: { id: instructorId } as FindOptionsWhere<User> });
      if (!instructor || instructor.role !== 'instructor') {
        throw { statusCode: 403, message: 'Only instructors can create courses' } as FastifyError;
      }

      let thumbnailUrl: string | undefined;
      if (thumbnail) {
        thumbnailUrl = await uploadToCloudinary(thumbnail);
      }

      const course = this.courseRepository.create({ ...courseData, instructor, thumbnailUrl, isApproved: false });
      return await this.courseRepository.save(course);
    } catch (error) {
      throw error;
    }
  }

  async addModule(courseId: number, moduleData: Partial<Module>): Promise<Module> {
    const course = await this.courseRepository.findOne({ where: { id: courseId } as FindOptionsWhere<Course> });
    if (!course) throw { statusCode: 404, message: 'Course not found' } as FastifyError;

    const module = this.moduleRepository.create({ ...moduleData, course, order: (course.modules.length || 0) + 1 });
    return await this.moduleRepository.save(module);
  }

  async getCourseById(id: number): Promise<Course> {
    const course = await this.courseRepository.findOne({
      where: { id } as FindOptionsWhere<Course>,
      relations: ['modules', 'instructor', 'enrollments']
    });
    if (!course) throw { statusCode: 404, message: 'Course not found' } as FastifyError;
    return course;
  }

  async updateCourse(id: number, courseData: Partial<Course>, thumbnail?: Buffer): Promise<Course> {
    const course = await this.courseRepository.findOne({ where: { id } as FindOptionsWhere<Course> });
    if (!course) throw { statusCode: 404, message: 'Course not found' } as FindOptionsWhere<Course>;

    if (thumbnail && course.thumbnailUrl) {
      // Optionally delete old thumbnail from Cloudinary (implement delete logic if needed)
    }
    if (thumbnail) course.thumbnailUrl = await uploadToCloudinary(thumbnail);

    Object.assign(course, courseData);
    return await this.courseRepository.save(course);
  }

  async deleteCourse(id: number): Promise<void> {
    const course = await this.courseRepository.findOne({ where: { id } as FindOptionsWhere<Course> });
    if (!course) throw { statusCode: 404, message: 'Course not found' } as FastifyError;
    await this.courseRepository.remove(course);
  }

  async getAllCourses(): Promise<Course[]> {
    return await this.courseRepository.find({ relations: ['instructor'] });
  }

  async approveCourse(id: number, adminId: number): Promise<Course> {
    const admin = await this.userRepository.findOne({ where: { id: adminId } as FindOptionsWhere<User> });
    if (!admin || admin.role !== 'admin') throw { statusCode: 403, message: 'Only admins can approve courses' } as FastifyError;

    const course = await this.courseRepository.findOne({ where: { id } as FindOptionsWhere<Course> });
    if (!course) throw { statusCode: 404, message: 'Course not found' } as FastifyError;

    course.isApproved = true;
    return await this.courseRepository.save(course);
  }

  async enrollStudent(courseId: number, studentId: number): Promise<Enrollment> {
    const course = await this.courseRepository.findOne({ where: { id: courseId, isApproved: true } as FindOptionsWhere<Course> });
    if (!course) throw { statusCode: 404, message: 'Course not found or not approved' } as FastifyError;

    const student = await this.userRepository.findOne({ where: { id: studentId, role: 'student' } as FindOptionsWhere<User> });
    if (!student) throw { statusCode: 403, message: 'Only students can enroll' } as FastifyError;

    const existingEnrollment = await this.enrollmentRepository.findOne({ where: { course, student } as FindOptionsWhere<Enrollment> });
    if (existingEnrollment) throw { statusCode: 400, message: 'Already enrolled' } as FastifyError;

    const enrollment = this.enrollmentRepository.create({ course, student, progress: 0, isCompleted: false });
    return await this.enrollmentRepository.save(enrollment);
  }

  async updateProgress(enrollmentId: number, progress: number): Promise<Enrollment> {
    const enrollment = await this.enrollmentRepository.findOne({ where: { id: enrollmentId } as FindOptionsWhere<Enrollment> });
    if (!enrollment) throw { statusCode: 404, message: 'Enrollment not found' } as FastifyError;

    enrollment.progress = Math.min(100, Math.max(0, progress));
    if (enrollment.progress === 100) enrollment.isCompleted = true;
    return await this.enrollmentRepository.save(enrollment);
  }
}