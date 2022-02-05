import { getSlug } from './../../core/utility';
import { Cate } from './../entities/category.entity';
import { getManager } from 'typeorm';
import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsCateExist(options?: ValidationOptions) {
  return function (obj: any, propertyName: string) {
    registerDecorator({
      target: obj.constructor,
      propertyName,
      options,
      constraints: [],
      validator: {
        async validate(value: string) {
          const cateRepo = getManager().getRepository(Cate);
          const isExist = await cateRepo.count({ slug: getSlug(value) });
          return !isExist;
        },
      },
    });
  };
}
