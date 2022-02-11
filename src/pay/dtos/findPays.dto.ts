import { Pay } from './../entities/pay.entity';
import { OutPagnation } from './../../core/dtos/pagnation.dto';
import { ArgsType, Field, ObjectType } from '@nestjs/graphql';
import { PagnationDto } from 'src/core/dtos/pagnation.dto';
import { IsOptional } from 'class-validator';

@ArgsType()
export class FindPaysDto extends PagnationDto {}

@ObjectType()
export class OutFindPays extends OutPagnation {
  @IsOptional()
  @Field(() => [Pay], { nullable: true })
  data?: Pay[];
}
