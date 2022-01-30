import { RestRepository } from './../repository/rest.repository';
import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { EntityManager, Repository } from 'typeorm';
import { RestEntity } from '../entities/rest.entity';

@ValidatorConstraint({ async: true, name: 'IsUserAlreadyExist' })
@Injectable()
export class IsUserAlreadyExistConstraint
  implements ValidatorConstraintInterface
{
  private repo: RestRepository;
  private Manager: EntityManager;

  validate(userName: any, args: ValidationArguments) {
    console.log(this.Manager);

    return false;
  }

  setRepository(rep: RestRepository) {
    this.repo = rep;
  }
}

export function IsUserAlreadyExist(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsUserAlreadyExist',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUserAlreadyExistConstraint,
    });
  };
}
