import { ItemService } from './item/item.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './user/user.service';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity';
import { ValidateCode } from './user/validationCode.entity';
import { AuthService } from 'src/auth/auth.service';
import { AuthModule } from 'src/auth/auth.module';
import { LoginModule } from './login/login.module';
import { ItemModule } from './item/item.module';
import { ItemController } from './item/item.controller';
import { Item } from './item/item.entity';

// 使用typeOrm连接数据库

@Module({
  imports: [
    UserModule,
    AuthModule,
    ItemModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '123456',
      database: 'mangosteen',
      entities: [Item, User, ValidateCode],
      synchronize: true,
      // autoLoadEntities: true,
      timezone: 'Z', // timezone默认用的是UTC的，需要设置成自己的时区 I fixed it by setting timezone to 'Z' in the connection options (the default is 'local').
    }),
    LoginModule,
  ],
  controllers: [AppController, UserController, ItemController],
  providers: [AppService, UserService, AuthService],
})
export class AppModule {}
