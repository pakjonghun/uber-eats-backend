import { ObjectType, Field, Int } from '@nestjs/graphql';
import { IsNumber, IsOptional } from 'class-validator';

@ObjectType()
export class PagnationDto {
  @IsNumber()
  @IsOptional()
  @Field(() => Int, { defaultValue: 1 })
  page?: number;
}

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
