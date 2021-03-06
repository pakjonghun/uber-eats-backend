import { Field, ObjectType } from '@nestjs/graphql';
import {
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@ObjectType()
export class Core {
  @PrimaryGeneratedColumn()
  @Field(() => Number)
  id: number;

  @UpdateDateColumn()
  @Field(() => Date)
  updatedAt: Date;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;
}
