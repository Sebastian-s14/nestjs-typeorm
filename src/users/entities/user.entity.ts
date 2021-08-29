import { Exclude } from 'class-transformer';
import { Module } from 'src/modules/entities/module.entity';
import { Type } from 'src/types/entities/type.entity';

import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  lastname: string;

  @Column({ type: 'varchar', length: 9, nullable: true })
  cellphone: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Exclude()
  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'varchar', length: 100 })
  role: string;

  @CreateDateColumn({ type: 'timestamp' })
  createAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updateAt: Date;

  @ManyToOne(() => Type, (type) => type.users)
  @JoinColumn({ name: 'type_id' })
  type: Type;

  @ManyToMany(() => Module, (module) => module.users)
  @JoinTable({
    name: 'users_modules',
    joinColumn: {
      name: 'user_id',
    },
    inverseJoinColumn: {
      name: 'module_id',
    },
  })
  modules: Module[];
}
