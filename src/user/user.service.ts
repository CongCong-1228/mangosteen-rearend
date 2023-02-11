import { ValidateCode } from './validationCode.entity';
import { randomCodeFunc } from './../utils/randomCode';
import { HttpException, Injectable, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { User } from './user.entity';
import { createTransport, getTestMessageUrl } from 'nodemailer';
import { assert } from 'node:console';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(ValidateCode)
    private validateCodeRepository: Repository<ValidateCode>,
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
  async update(user: any): Promise<any> {
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
    const randomCode = randomCodeFunc();

    const info = await transporter.sendMail(
      {
        from: 'fivesun1228@163.com', // sender address
        to: email, // list of receivers
        subject: '验证码', // Subject line
        html: `<p>你好！</p>
      <p>您正在注册山竹记账</p>
      <p>你的验证码是：<strong style="color: #ff4e2a;">${randomCode}</strong></p>
      <p>***该验证码5分钟内有效***</p>`, // html 内容`, // html body
      },
      function (error) {
        assert(!error, 500, '发送验证码错误！');
        transporter.close(); // 如果没用，关闭连接池
      },
    );
    const existCode = await this.validateCodeRepository.findAndCountBy({
      email,
      kind: 'login',
    });

    console.log('existCode=====>', existCode[0][existCode[1] - 1]);
    const validateCode = await this.validateCodeRepository.save({
      code: randomCode,
      email,
      kind: 'login',
    });
    console.log('validateCode', validateCode);
  }
}
