import { AuthService } from 'src/auth/auth.service';
import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  //   @UseGuards(LocalAuthGuard)
  @Post('/login')
  login(@Body() body) {
    console.log('req', body);
    return this.authService.login({ ...body });
  }
}
