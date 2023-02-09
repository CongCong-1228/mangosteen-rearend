import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create({ name, email }): Promise<void> {
    if (!name) {
      throw new HttpException('没有用户名', 401);
    }
    if (!email) {
      throw new HttpException('没有邮箱', 401);
    }
    const newUser = await this.usersRepository.save({ name, email });
    console.log('newUser', newUser);
  }

  // 查询数据库所有user，返回值类型是User[]
  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  // 查询数据库单个user，传参是id，返回值是单个User
  findById(id: number): Promise<User> {
    return this.usersRepository.findOneBy({ id });
  }

  // 删除单个user，传参是id，返回值是void
  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }

  // 修改单个user的信息
  async update(id: any, user: any): Promise<User> {
    const existUser = await this.usersRepository.findOneBy({ id });
    if (!existUser) {
      throw new HttpException(`id为${id}的用户不存在`, 401);
    }
    const updateUser = this.usersRepository.merge(existUser, user);
    return this.usersRepository.save(updateUser);
  }
}
