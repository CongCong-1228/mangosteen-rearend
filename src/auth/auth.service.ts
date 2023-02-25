import { Inject, Injectable, Req, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';

/*
  使用@nestjs/jwt可以对`jwt`进行管理操作，使用`AuthFGuard`本地护照策略就可以做到:


    1，只有验证成功后的才能调用路由控制器

    2，求情参数包含当前用户属性信息

*/

@Injectable()
export class AuthService {
  // private jwtService: JwtService,
  constructor(
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    private jwtService: JwtService, // eslint-disable-next-line @typescript-eslint/no-empty-function
  ) {}

  async validateUser(name, email) {
    const user = await this.userService.findOne(email);
    if (user && user.email === email) {
      return user;
    } else {
      return null;
    }
  }

  async login(user: User) {
    const payload = { username: user.name, sub: user.email };
    console.log('aaa');
    return {
      // 使用jwtService中的sign方法来生成jwt作为参数
      access_token: this.jwtService.sign(payload),
    };
  }
}
