import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { UserController } from './user.controller';
import { ValidateCode } from './validationCode.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, ValidateCode])],
  providers: [UserService],
  exports: [TypeOrmModule],
})
export class UserModule {}
