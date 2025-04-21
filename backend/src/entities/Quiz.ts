import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { Module } from './Module';
import { Question } from './Question';
import { QuizAttempt } from './QuizAttempt';

@Entity('quizzes')
export class Quiz {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column('text')
  description!: string;

  @Column()
  passingScore!: number;

  @Column()
  timeLimit!: number; // in minutes

  @ManyToOne(() => Module, module => module.quizzes)
  module!: Module;

  @OneToMany(() => Question, question => question.quiz)
  questions!: Question[];

  @OneToMany(() => QuizAttempt, attempt => attempt.quiz)
  attempts!: QuizAttempt[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
} 