import { Rest } from './../entities/rest.entity';
import { OutMutation } from './../../core/dtos/mutation.dto';
import {
  ArgsType,
  Field,
  InputType,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { IsOptional, IsNumber, IsString } from 'class-validator';

@ObjectType()
export class OutRestUpdate extends OutMutation {
  @IsOptional()
  @Field(() => Rest, { nullable: true })
  rest?: Rest;
}

@InputType()
class NewRest extends PartialType(PickType(Rest, ['adress', 'img', 'name'])) {
  @IsString()
  @Field(() => String, { nullable: true })
  cateName?: string;
}

@ArgsType()
export class UpdateRestDto {
  @IsOptional()
  @Field(() => NewRest, { defaultValue: {} })
  rest?: NewRest;

  @IsNumber()
  @Field(() => Number)
  id: number;
}
