import { JwtAuthGuard } from './../auth/jwt-auth.guard';
import { AuthService } from 'src/auth/auth.service';
import { Body, Post, Req, Res, UseGuards } from '@nestjs/common';
/* eslint-disable prettier/prettier */
import { Controller } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';

// 对于身份验证的角度下有两种状态

/*
    1，用户未登录（未验证）

        在用户未登录的情况，需要执行两个不同的功能

            （1）限制未经过身份验证可以访问的路由，可以使用`Guard`注解来支持受限路由

            （2）当未经过身份验证尝试登录时候，启动身份验证步骤需要处理的业务

    2，用户登录（已验证）

 */

@Controller('login')
export class LoginController {
  constructor(private authService: AuthService) {}
  @UseGuards(LocalAuthGuard)
  @Post('')
  async login(@Body() req) {
    return this.authService.login({ ...req });
  }

  // 关联受限的路由，这个路由需要jwt才能访问

  @UseGuards(JwtAuthGuard)
  @Post('profile')
  getProfile(@Body() body) {
    return { ...body };
  }
}
