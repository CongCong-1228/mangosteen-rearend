import { Inject, Injectable, Req, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  // private jwtService: JwtService,
  constructor(
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    private jwtService: JwtService, // eslint-disable-next-line @typescript-eslint/no-empty-function
  ) {}

  async validateUser(name: string, email: string, token: string) {
    const user = await this.userService.findOne(name, email);

    if (user && user.token === token) {
      const { email, ...result } = user;
      return result;
    } else {
      return null;
    }
  }

  async login(user: User) {
    const payload = { username: user.name, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload, { secret: 'fivesun1228' }),
    };
  }
}
