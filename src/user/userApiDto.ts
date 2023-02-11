/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';

// @ApiProperty 设置属性

export class createUserDto {
  @ApiProperty({ default: '孙聪' })
  name: string;

  @ApiProperty({ default: '819745585@qq.com' })
  email: string;
}

export class queryUserDto {
  @ApiProperty({ minimum: 1, default: 1 })
  id: number;
}

export class updateUserDto {
  @ApiProperty({ minimum: 1, default: 1 })
  id: number;

  @ApiProperty({ default: '孙聪' })
  name: string;

  @ApiProperty({ default: '819745585@qq.com' })
  email: string;
}

export class sendEmailDto {
  @ApiProperty({ default: '819745585@qq.com' })
  email: string;
}
