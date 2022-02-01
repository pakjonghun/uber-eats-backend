import { UserRepo } from './../users/repository/user.repository';
import {
  GoneException,
  Injectable,
  NestMiddleware,
  NotFoundException,
} from '@nestjs/common';
import { NextFunction } from 'express';
import { JwtService } from './jwt.service';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(
    private readonly userRepo: UserRepo,
    private readonly jwtService: JwtService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      if ('authorization' in req.headers) {
        const payload = this.jwtService.verify(req.headers['authorization']);
        if (typeof payload === 'object' && 'id' in payload) {
          const user = await this.userRepo.findOne({ id: payload['id'] });
          if (!user) throw new NotFoundException();
          const { password, ...rest } = user;
          req['user'] = rest;
        }
      }
    } catch (err) {
    } finally {
      next();
    }
  }
}
