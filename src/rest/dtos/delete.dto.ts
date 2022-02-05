import { OutMutation } from './../../core/dtos/mutation.dto';
import { Rest } from './../entities/rest.entity';
import { ArgsType, Field, ObjectType, Int } from '@nestjs/graphql';
import { IsNumber, IsOptional } from 'class-validator';

@ArgsType()
export class DeleteDto {
  @IsNumber()
  @Field(() => Int)
  id: number;
}

@ObjectType()
export class OutDelete extends OutMutation {
  @IsOptional()
  @Field(() => Rest, { nullable: true })
  rest: Rest;
}
