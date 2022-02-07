import { ObjectType, Field, Int, ArgsType, InputType } from '@nestjs/graphql';
import { IsNumber, IsOptional } from 'class-validator';

@ArgsType()
export class PagnationDto {
  @IsNumber()
  @IsOptional()
  @Field(() => Int, { defaultValue: 1 })
  page?: number;
}

@ObjectType()
export class OutPagnation {
  @IsNumber()
  @IsOptional()
  @Field(() => Int, { nullable: true })
  totalPages?: number;

  @IsNumber()
  @IsOptional()
  @Field(() => Int, { nullable: true })
  totalResults?: number;
}
