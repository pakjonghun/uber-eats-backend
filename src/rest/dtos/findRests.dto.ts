import { Rest } from './../entities/rest.entity';
import { OutPagnation } from './../../core/dtos/pagnation.dto';
import { ArgsType, Field, ObjectType } from '@nestjs/graphql';
import { PagnationDto } from 'src/core/dtos/pagnation.dto';

@ArgsType()
export class FindRestDto extends PagnationDto {}

@ObjectType()
export class OutFindRestDto extends OutPagnation {
  @Field(() => [Rest], { nullable: true })
  data?: Rest[];
}
