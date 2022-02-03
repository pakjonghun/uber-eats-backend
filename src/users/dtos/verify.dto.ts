import { Verify } from './../entities/verify.entity';
import { OutMutation } from '../../core/dtos/mutation.dto';
import { ObjectType, ArgsType, PickType } from '@nestjs/graphql';

@ObjectType()
export class OutVerify extends OutMutation {}

@ArgsType()
export class VerifyDto extends PickType(Verify, ['code'], ArgsType) {}
