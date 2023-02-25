import { JwtService } from '@nestjs/jwt';
import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from './item.entity';
import { Repository } from 'typeorm';
import { isTimeStamp } from 'src/utils/istimestamp';
import { User } from 'src/user/user.entity';

/*
    typeorm提供了createQueryBuilder('item')的方式便于查询数据库等信息


    包括如何添加查询条件，如何进行关联查询，如何进行分页和排序等
*/

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(Item)
    private itemRepository: Repository<Item>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  // 日期只接收时间戳形式(秒时间戳)
  async queryItems({ start, end, page, pageSize }) {
    if (!pageSize) pageSize = 10;
    if (!page) page = 1;
    if (!start || !end) throw new HttpException('传参不对啊', 401);
    if (!isTimeStamp(start) || !isTimeStamp(end))
      throw new HttpException('日期格式不对', 401);
    if (start >= end)
      throw new HttpException('开始日期不能大于或等于结束日期', 401);

    // 记录要跳过的记录数，通过页数-1，乘一页的数量
    const skipCount = (page - 1) * pageSize;
    const qb = this.itemRepository.createQueryBuilder('item');
    const items = await qb
      .where('item.create_time between :start and :end', {
        start,
        end,
      })
      .skip(skipCount)
      .take(pageSize)
      .getMany();
    return items;
  }

  async createItem({ name, jwt }) {
    const success = await this.itemRepository.save({ name });
    const jwtDecode = this.jwtService.decode(
      jwt.toString().split('Bearer')[1].trim(),
    );
    console.log('jwtDecode', jwtDecode);
    const exitUser = this.userRepository.findOneBy({ email: '111' });
    if (success) return '创建成功';
    else throw new HttpException('创建失败', 401);
  }

  async updateItem({ name, userId }) {
    const exitItem = await this.itemRepository.findOneBy({ userId });
    if (!exitItem) throw new HttpException('不存在', 401);
    const updateItem = this.itemRepository.merge(exitItem, { name, userId });
    return this.itemRepository.save(updateItem);
  }
}
