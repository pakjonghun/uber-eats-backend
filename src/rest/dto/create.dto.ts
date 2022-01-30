import { RestEntity } from './../entities/rest.entity';
import { InputType, Field, ArgsType, OmitType } from '@nestjs/graphql';
import { IsBoolean, IsString } from 'class-validator';

// object 를 args 로 전달 할수 있게 해준다
@InputType()
export class SecondArgs extends OmitType(
  RestEntity,
  ['id', 'createdAt', 'updatedAt'],
  InputType,
) {}

//객체를 제거한 값을 args 로 전달 할수 있게 해주는 decoration
@ArgsType()
export class ThirdArgs extends OmitType(
  RestEntity,
  ['id', 'updatedAt', 'createdAt'],
  ArgsType,
) {}
