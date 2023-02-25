import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger';
import {
  createUserDto,
  queryUserDto,
  sendEmailDto,
  updateUserDto,
} from './userApiDto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

// 添加标签
@ApiBearerAuth()
@ApiTags('用户')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  // 描述
  @ApiOperation({ summary: '创建用户' })
  async create(@Body() body: createUserDto) {
    return await this.userService.create({ ...body });
  }

  @UseGuards(JwtAuthGuard)
  @Post('login')
  @ApiOperation({ summary: '用户登录' })
  async login(@Body() body) {
    return await this.userService.login({ ...body });
  }

  @Post('query')
  @ApiOperation({ summary: '查询单个用户' })
  @ApiProperty()
  query(@Body() body: queryUserDto) {
    return this.userService.findById(Number(body.id));
  }

  @Post('update')
  @ApiOperation({ summary: '更新用户信息' })
  update(@Body() body: updateUserDto) {
    return this.userService.update(body);
  }

  @Post('delete')
  @ApiOperation({ summary: '删除用户' })
  delete(@Body() body: queryUserDto) {
    return this.userService.remove(Number(body.id));
  }

  @Post('queryAll')
  @ApiOperation({ summary: '查询所有用户' })
  queryAll() {
    return this.userService.queryAll();
  }

  @Post('validateCode')
  @ApiOperation({ summary: '发送邮箱验证码' })
  getEmailCode(@Body() body: sendEmailDto) {
    return this.userService.create({ ...body });
  }
}
