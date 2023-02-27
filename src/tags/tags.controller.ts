import { JwtAuthGuard } from './../auth/jwt-auth.guard';
import { Tags } from 'src/tags/tags.entity';
import { TagsService } from './tags.service';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';

@Controller('tags')
export class TagsController {
  constructor(private tagsService: TagsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('')
  query(@Body() body) {
    const { userId, page, pageSize } = body;
    return this.tagsService.findAll(userId, page, pageSize);
  }

  @UseGuards(JwtAuthGuard)
  @Post('create')
  createTag(@Body() body: Tags) {
    const { name, sign, userId } = body;
    return this.tagsService.createTag(name, sign, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('update')
  updateTag(@Body() body: Tags) {
    const { name, sign, userId } = body;
    return this.tagsService.updateTag(name, sign, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('delete')
  deleteTag(@Body() body) {
    const { id, userId } = body;
    return this.tagsService.deleteTag(userId, id);
  }
}
