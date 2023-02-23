import { JwtService } from '@nestjs/jwt';
import { ValidateCode } from './validationCode.entity';
import { randomCodeFunc } from './../utils/randomCode';
import {
  HttpException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { User } from './user.entity';
import { createTransport } from 'nodemailer';
import { assert } from 'node:console';
import * as moment from 'moment';
import 'moment-timezone';
import { AuthService } from 'src/auth/auth.service';

moment.tz.setDefault('Asia/Shanghai');
@Injectable()
export class UserService {
  constructor(
    @Inject(forwardRef(() => AuthService)) private authService: AuthService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(ValidateCode)
    private validateCodeRepository: Repository<ValidateCode>, // private authService: AuthService,
  ) {}

  // 创建
  async create({ name, email }): Promise<any> {
    if (!name) {
      throw new HttpException('没有用户名', 401);
    }
    if (!email) {
      throw new HttpException('没有邮箱', 401);
    }
    const existEmail = await this.validateCodeRepository.findOneBy({ email });
    // 说明就没收验证码在登录
    if (existEmail.used_at === null) {
      throw new HttpException('不能登录', 404);
    } else {
      const existUser = await this.usersRepository.findOneBy({ email });
      if (!existUser) {
        throw new NotFoundException('该用户不存在');
      } else {
        return this.authService.login(existUser);
      }
    }
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

  // 查询(名字)
  async findOne(email: string): Promise<User | undefined> {
    return this.usersRepository.findOneBy({ email });
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

  async getEmailCode(email: string, name: string): Promise<void> {
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

    await transporter.sendMail(
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
    if (existCode[1] !== 0) {
      const lastDate = existCode[0][existCode[1] - 1].create_time;
      const lastTimestamp = moment(lastDate).valueOf();
      const nowTimestamp = moment().utc().hour(16).valueOf();
      if (Math.abs(lastTimestamp - nowTimestamp) < 60000) {
        throw new HttpException('不要频繁发送验证码', 401);
      } else {
        await this.validateCodeRepository.save({
          code: randomCode,
          email,
          kind: 'login',
          used_at: 'used',
        });
        await this.usersRepository.save({ name, email });
      }
    } else {
      await this.validateCodeRepository.save({
        code: randomCode,
        email,
        kind: 'login',
        used_at: 'used',
      });
      await this.usersRepository.save({ name, email });
      await this.create({ name, email });
    }
  }
}
