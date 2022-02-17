import { OutMutation } from './../../core/dtos/mutation.dto';
import { Rest } from './../entities/rest.entity';
import {
  Field,
  InputType,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@ObjectType()
export class OutRegisterRest extends OutMutation {
  @IsOptional()
  @Field(() => Rest, { nullable: true })
  rest?: Rest;
}

@InputType()
export class RegisterRestDto extends PartialType(
  PickType(Rest, ['adress', 'img', 'name']),
) {
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  cateName?: string;
}
