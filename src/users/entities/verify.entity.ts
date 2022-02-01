import { Users } from './users.entity';
import { IsString } from 'class-validator';
import { Core } from 'src/core/entities/core.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { v4 as uuidv4 } from 'uuid';

@Entity()
@ObjectType()
export class Verify extends Core {
  @Column({ unique: true })
  @IsString()
  @Field(() => String)
  code: string;

  @OneToOne(() => Users, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: Users;

  @BeforeInsert()
  @BeforeUpdate()
  hashCode() {
    this.code = uuidv4();
  }
}
