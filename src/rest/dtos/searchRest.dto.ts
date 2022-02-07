import { Rest } from './../entities/rest.entity';
import { OutPagnation } from './../../core/dtos/pagnation.dto';
import { ArgsType, Field, ObjectType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';
import { PagnationDto } from 'src/core/dtos/pagnation.dto';

@ArgsType()
export class RestSearchDto extends PagnationDto {
  @IsString()
  @Field(() => String)
  term: string;
}

@ObjectType()
export class OutRestSestch extends OutPagnation {
  @IsOptional()
  @Field(() => [Rest], { nullable: true })
  data?: Rest[];
}
