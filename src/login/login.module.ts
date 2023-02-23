import { AuthModule } from 'src/auth/auth.module';
import { Module } from '@nestjs/common';
import { LoginController } from './login.controller';

@Module({
  controllers: [LoginController],
  imports: [AuthModule],
})
export class LoginModule {}
