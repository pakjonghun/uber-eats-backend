import * as jwt from 'jsonwebtoken';
import { CONFIG_OPTION } from './interface/jwt.constants';
import { Inject, Injectable } from '@nestjs/common';
import { JwtModuleOptions } from './interface/jwt.interface';

@Injectable()
export class JwtService {
  constructor(
    @Inject(CONFIG_OPTION) private readonly options: JwtModuleOptions,
  ) {}

  sign(id: number) {
    return jwt.sign({ id }, this.options.privateKey);
  }

  verify(token: string) {
    return jwt.verify(token, this.options.privateKey);
  }
}
