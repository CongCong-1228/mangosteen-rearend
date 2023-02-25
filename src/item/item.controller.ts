import { JwtAuthGuard } from './../auth/jwt-auth.guard';
import {
  Body,
  Controller,
  Headers,
  Inject,
  Post,
  UseGuards,
  forwardRef,
} from '@nestjs/common';
import { ItemService } from './item.service';
import { JwtService } from '@nestjs/jwt';

@Controller('item')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  // 访问item信息需要鉴权
  @UseGuards(JwtAuthGuard)
  @Post('')
  getItems(@Body() body) {
    return this.itemService.queryItems({ ...body });
  }

  @UseGuards(JwtAuthGuard)
  @Post('create')
  createItem(@Body() body, @Headers() headers) {
    return this.itemService.createItem({ ...body, jwt: headers.authorization });
  }
}
