import { UserRepo } from './../users/repository/user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';

@Module({
  imports: [TypeOrmModule.forFeature([UserRepo])],
  providers: [AuthService, { provide: APP_GUARD, useClass: AuthGuard }],
  exports: [AuthService],
})
export class AuthModule {}
