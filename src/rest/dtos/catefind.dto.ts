import { PagnationDto, OutPagnation } from './../../core/dtos/pagnation.dto';
import { IsOptional } from 'class-validator';
import { Cate } from './../entities/category.entity';
import { ArgsType, Field, ObjectType } from '@nestjs/graphql';
@ObjectType()
export class FindAllCate extends OutPagnation {
  @IsOptional()
  @Field(() => [Cate], { nullable: true })
  data?: Cate[];
}

@ArgsType()
export class FindAllCateDto extends PagnationDto {}
