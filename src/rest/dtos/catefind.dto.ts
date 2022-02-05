import { IsOptional } from 'class-validator';
import { Cate } from './../entities/category.entity';
import { Field, ObjectType } from '@nestjs/graphql';
@ObjectType()
export class FindAllCate {
  @IsOptional()
  @Field(() => [Cate], { nullable: true })
  data?: Cate[];
}
