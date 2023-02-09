import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Query('name') name, @Query('email') email) {
    console.log('name', name);
    console.log('email', email);
    return await this.userService.create({ name, email });
    return `name: ${name}`;
  }

  @Get(':id')
  find(id: number) {
    return this.userService.findById(id);
  }
}
