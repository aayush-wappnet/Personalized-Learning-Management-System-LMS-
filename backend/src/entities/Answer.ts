import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Question } from './Question';

@Entity('answers')
export class Answer {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('text')
  text!: string;

  @Column()
  isCorrect!: boolean;

  @ManyToOne(() => Question, question => question.answers)
  question!: Question;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
} 