import { Tags } from 'src/tags/tags.entity';
import { TagsService } from './tags.service';
import { Body, Controller, Post } from '@nestjs/common';

@Controller('tags')
export class TagsController {
  constructor(private tagsService: TagsService) {}
  @Post('')
  query(@Body() body) {
    const { userId, page, pageSize } = body;
    return this.tagsService.findAll(userId, page, pageSize);
  }

  @Post('create')
  createTag(@Body() body: Tags) {
    const { name, sign, userId } = body;
    return this.tagsService.createTag(name, sign, userId);
  }

  @Post('update')
  updateTag(@Body() body: Tags) {
    const { name, sign, userId } = body;
    return this.tagsService.updateTag(name, sign, userId);
  }

  @Post('delete')
  deleteTag(@Body() body) {
    const { id, userId } = body;
    return this.tagsService.deleteTag(userId, id);
  }
}
