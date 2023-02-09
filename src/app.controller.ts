import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  // post请求路径
  @Post('create')
  create(): object {
    return { id: 1 };
  }

  // get请求通配符 *
  @Get('/user_*')
  user(): string {
    return 'user 通配符';
  }

  // 带参数路径

  @Get('list/:id')
  list(): string {
    return 'hello';
  }
}
