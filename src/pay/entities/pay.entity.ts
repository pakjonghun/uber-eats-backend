import { Rest } from './../../rest/entities/rest.entity';
import { Users } from './../../users/entities/users.entity';
import { Core } from './../../core/entities/core.entity';
import { Field, InputType, ObjectType, Int, Float } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, RelationId } from 'typeorm';
import { IsNumber, IsOptional, IsString } from 'class-validator';

@Entity()
@InputType('payInputType', { isAbstract: true })
@ObjectType()
export class Pay extends Core {
  @Field(() => String)
  @Column()
  @IsString()
  transactionId: string;

  @Field(() => Users)
  @ManyToOne(() => Users, (user) => user.pay, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  user: Users;

  @RelationId((col: Pay) => col.user)
  userId: number;

  @Field(() => Float, { nullable: true })
  @Column({ nullable: true })
  @IsNumber()
  @IsOptional()
  price?: number;

  @ManyToOne(() => Rest, (rest) => rest.pay)
  @Field(() => Rest)
  rest: Rest;

  @Field(() => Int)
  @RelationId((col: Pay) => col.rest)
  restId: number;
}
