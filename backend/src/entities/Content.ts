import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Module } from './Module';

@Entity('contents')
export class Content {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column('text')
  content!: string;

  @Column()
  type!: 'text' | 'video' | 'pdf';

  @Column({ nullable: true })
  url?: string;

  @Column()
  order!: number;

  @ManyToOne(() => Module, module => module.contents)
  module!: Module;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
} 