import { PagnationDto } from './../../core/dtos/pagnation';
import { Users } from './../entities/users.entity';
import { ArgsType, ObjectType, OmitType } from '@nestjs/graphql';

@ArgsType()
export class FindAllDto extends PagnationDto {}

@ObjectType()
export class OutFindAll extends OmitType(Users, ['password']) {}
