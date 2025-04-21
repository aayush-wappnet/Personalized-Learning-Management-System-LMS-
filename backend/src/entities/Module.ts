import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { Course } from './Course';
import { Content } from './Content';
import { Quiz } from './Quiz';

@Entity('modules')
export class Module {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column('text')
  description!: string;

  @Column()
  order!: number;

  @ManyToOne(() => Course, course => course.modules)
  course!: Course;

  @OneToMany(() => Content, content => content.module)
  contents!: Content[];

  @OneToMany(() => Quiz, quiz => quiz.module)
  quizzes!: Quiz[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
} 