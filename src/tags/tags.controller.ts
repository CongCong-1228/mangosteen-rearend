import { Controller, Post } from '@nestjs/common';

@Controller('tags')
export class TagsController {
  @Post('')
  create() {
    return 'helklo';
  }
}
