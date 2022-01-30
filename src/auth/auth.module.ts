import { UserRepo } from './../users/repository/user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [TypeOrmModule.forFeature([UserRepo])],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
