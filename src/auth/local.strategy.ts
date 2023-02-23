/* eslint-disable prettier/prettier */
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

/*
    实施passport本地验证策略，默认接收的是`username`和`password`属性，如果需要指定不同的属性名称，可以构造函数调用


      `super({usernameField: 'name', passwordField: 'email'})


      大部分验证工作在 AuthService 之下完成，找到用户并且 Token 有效，则会奇偶性下一步任务，否则抛出异常



*/

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'name', passwordField: 'email' });
  }
  async validate(name: string, email: string): Promise<any> {
    const user = await this.authService.validateUser(name, email);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
