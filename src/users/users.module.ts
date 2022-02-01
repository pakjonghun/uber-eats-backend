import { VerifyRepo } from './repository/verify.repository';
import { UserRepo } from './repository/user.repository';
import { AuthModule } from './../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserResolver } from './user.resolver';
import { Module } from '@nestjs/common';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserRepo, VerifyRepo]), AuthModule],
  providers: [UserResolver, UserService],
  exports: [UserService],
})
export class UsersModule {}
