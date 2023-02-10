import { HttpException, Injectable, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { User } from './user.entity';
import { createTransport, getTestMessageUrl } from 'nodemailer';

import { randomCodeFunc } from '../utils/randomCode';

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

  async getEmailCode(email: string): Promise<void> {
    // 邮箱正则
    const regEmail =
      /^([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+.[a-zA-Z]{2,3}$/;
    const regex = new RegExp(regEmail);
    if (!regex.test(email)) {
      throw new HttpException('请输入正确格式的邮箱', 401);
    }
    const transporter = createTransport({
      host: 'smtp.163.com',
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: 'fivesun1228@163.com', // generated ethereal user
        pass: 'OSLTSJKBGVJQWMMC', // generated ethereal password
      },
    });

    const info = await transporter.sendMail({
      from: 'fivesun1228@163.com', // sender address
      to: email, // list of receivers
      subject: '验证码', // Subject line
      html: `<h2>你好你的验证码是</h2><h1>${randomCodeFunc()}</h1>`, // html body
    });
    console.log('Message sent: %s', info);
    console.log('randomCodeFunc()', randomCodeFunc());
    console.log('Preview URL: %s', getTestMessageUrl(info));
  }
}
