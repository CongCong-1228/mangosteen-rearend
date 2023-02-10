import { HttpException, Injectable, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // 创建
  async create({ name, email }): Promise<User> {
    if (!name) {
      throw new HttpException('没有用户名', 401);
    }
    if (!email) {
      throw new HttpException('没有邮箱', 401);
    }
    const newUser = await this.usersRepository.save({ name, email });
    return newUser;
  }

  // 查询(全部)
  async queryAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  // 查询(单个)
  async findById(id: number): Promise<User> {
    if (!id) {
      throw new HttpException('请传递正确的id', 401);
    }
    const user = await this.usersRepository.findOneBy({ id });
    if (user) {
      return user;
    } else {
      throw new HttpException('没有对应id的用户', 401);
    }
  }

  // 删除
  async remove(id: number): Promise<DeleteResult> {
    const existUser = await this.usersRepository.findOneBy({ id });
    if (!existUser) {
      throw new HttpException(`id为${id}的用户不存在`, 401);
    }
    return await this.usersRepository.delete(id);
  }

  // 更新(单个)
  async update(user: User): Promise<any> {
    const { id, name, email } = user;
    if (!id) {
      throw new HttpException('缺少id!', 401);
    }
    const existUser = await this.usersRepository.findOneBy({ id });
    if (!existUser) {
      throw new HttpException(`id为${id}的用户不存在`, 401);
    }
    const updateObject = Object.assign({}, { name, email });
    const updateUser = this.usersRepository.merge(existUser, updateObject);
    return this.usersRepository.save(updateUser);
  }
}
