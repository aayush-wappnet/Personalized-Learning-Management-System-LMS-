import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BeforeInsert, BeforeUpdate, OneToMany } from 'typeorm';
import { Role } from '../types/roles';
import { hash } from 'bcrypt';
import { Course } from './Course';
import { Enrollment } from './Enrollment';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.STUDENT
  })
  role!: Role;

  @Column({ default: true })
  isActive!: boolean;

  @OneToMany(() => Course, course => course.instructor)
  courses!: Course[];

  @OneToMany(() => Enrollment, enrollment => enrollment.student)
  enrollments!: Enrollment[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // Virtual field for full name
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  // Hash password before insert and update
  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      this.password = await hash(this.password, 10);
    }
  }

  // Method to safely return user data without password
  toJSON() {
    return {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      role: this.role,
      isActive: this.isActive,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      fullName: this.fullName
    };
  }
} 
