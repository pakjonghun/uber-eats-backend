import { Users } from './../users/entities/users.entity';
import { registerDecorator, ValidationOptions } from 'class-validator';
import { getManager } from 'typeorm';

type Action = 'Login' | 'Register';

export function IsEmailExist(
  action: Action,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsEmailExist',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        async validate(value: any) {
          if (typeof value === 'string' && value.trim()) {
            const user = getManager().getRepository(Users);
            const isExist = await user.count({ email: value });
            return action === 'Login' ? !!isExist : !isExist;
          }
        },
      },
    });
  };
}
