import { Rest } from './../entities/rest.entity';
import { Cate } from './../entities/category.entity';
import { OutPagnation } from './../../core/dtos/pagnation.dto';
import { ArgsType, Field, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { PagnationDto } from 'src/core/dtos/pagnation.dto';

@ArgsType()
export class FindOneCateDto extends PagnationDto {
  @IsString({ message: 'must be string' })
  @Field(() => String)
  slug: string;
}

@ObjectType()
export class OutFindOneCate extends OutPagnation {
  @Field(() => Cate, { nullable: true })
  date?: Cate;

  @Field(() => [Rest], { nullable: true })
  rest?: Rest[];
}
