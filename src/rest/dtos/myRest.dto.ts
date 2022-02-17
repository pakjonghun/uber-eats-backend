import { Field, ObjectType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { Rest } from '../entities/rest.entity';

@ObjectType()
export class OutMyRest {
  @IsOptional()
  @Field(() => [Rest], { nullable: true })
  rest?: Rest[];
}
