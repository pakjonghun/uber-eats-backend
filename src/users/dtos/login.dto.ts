import { OutMutation } from '../../core/dtos/mutation.dto';
import { Users } from './../entities/users.entity';
import { ArgsType, PickType, ObjectType, Field } from '@nestjs/graphql';
import { IsEmail, IsOptional, IsString } from 'class-validator';
import { IsEmailExist } from 'src/auth/validate.decorator';

@ArgsType()
export class LoginDto extends PickType(Users, ['password'], ArgsType) {
  @Field(() => String)
  @IsEmailExist('Login', { message: 'email exist' })
  @IsEmail({ message: 'email plz' })
  email: string;
}

@ObjectType()
export class OutLogin extends OutMutation {
  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  token?: string;
}
