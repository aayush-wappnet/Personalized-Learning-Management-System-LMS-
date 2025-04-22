import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from './User';
import { Quiz } from './Quiz';

@Entity('quiz_attempts')
export class QuizAttempt {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  score!: number;

  @Column()
  timeSpent!: number; // in seconds

  @Column('jsonb')
  answers!: Record<string, string>;

  @ManyToOne(() => User, user => user.quizAttempts)
  student!: User;

  @ManyToOne(() => Quiz, quiz => quiz.attempts)
  quiz!: Quiz;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}