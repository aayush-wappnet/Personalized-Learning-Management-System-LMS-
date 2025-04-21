import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from './User';
import { Course } from './Course';

@Entity('enrollments')
export class Enrollment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ default: 0 })
  progress!: number;

  @Column({ default: false })
  isCompleted!: boolean;

  @ManyToOne(() => User, user => user.enrollments)
  student!: User;

  @ManyToOne(() => Course, course => course.enrollments)
  course!: Course;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
} 