import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { ValidateCode } from './validationCode.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, ValidateCode])],
  providers: [UserService, AuthService, JwtService],
  exports: [TypeOrmModule, AuthService],
})
export class UserModule {}
