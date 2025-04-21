import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from './User';
import { Module } from './Module';
import { Enrollment } from './Enrollment';

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column('text')
  description!: string;

  @Column({ default: true })
  isActive!: boolean;

  @Column({ default: 0 })
  price!: number;

  @Column({ nullable: true })
  thumbnailUrl?: string;

  @ManyToOne(() => User, user => user.courses)
  instructor!: User;

  @OneToMany(() => Module, module => module.course)
  modules!: Module[];

  @OneToMany(() => Enrollment, enrollment => enrollment.course)
  enrollments!: Enrollment[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
} 