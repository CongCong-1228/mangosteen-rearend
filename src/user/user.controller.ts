import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  async create(@Body('name') name, @Body('email') email) {
    return await this.userService.create({ name, email });
  }

  @Post('query')
  query(@Body('id') id) {
    return this.userService.findById(Number(id));
  }

  @Post('update')
  update(@Body() body) {
    return this.userService.update(body);
  }

  @Post('delete')
  delete(@Body('id') id) {
    return this.userService.remove(Number(id));
  }

  @Post('queryAll')
  queryAll() {
    return this.userService.queryAll();
  }
}
