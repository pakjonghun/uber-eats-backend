import { UserRepo } from './repository/user.repository';
import { AuthModule } from './../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserResolver } from './user.resolver';
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { Users } from './entities/users.entity';
import { JwtModule } from 'src/jwt/jwt.module';
import { JwtService } from 'src/jwt/jwt.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserRepo]), AuthModule],
  providers: [UserResolver, UserService],
  exports: [UserService],
})
export class UsersModule {}
