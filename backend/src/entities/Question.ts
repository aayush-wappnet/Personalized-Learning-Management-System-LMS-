import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { Quiz } from './Quiz';
import { Answer } from './Answer';

@Entity('questions')
export class Question {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('text')
  question!: string;

  @Column()
  type!: 'multiple-choice' | 'true-false' | 'short-answer';

  @Column()
  points!: number;

  @ManyToOne(() => Quiz, quiz => quiz.questions)
  quiz!: Quiz;

  @OneToMany(() => Answer, answer => answer.question)
  answers!: Answer[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
} 