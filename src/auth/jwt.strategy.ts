/* eslint-disable prettier/prettier */
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from './constants';

/*

  jwtStrategy注意下面几个选项：

    `jwtFromRequest`: 提取请求头中的`Authorization`承载的`token`信息

    `ignoreExpiration`: 默认为false，对于没有过期的`jwt`信息继续委托`passport`下的任务，过期则显示`401`的`http`状态码

    `secretOrKey`: 签名所需要的密钥信息

    `validate()` 方法是用于`passport`解密后会调用`validate()`方法，将解码的`json`作为参数传递，确保给客户端发送是有效期的`token`信息

    将`jwtStrategy`加入`AuthModule`中

*/

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username };
  }
}
