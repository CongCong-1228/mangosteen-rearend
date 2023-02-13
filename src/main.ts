import { HttpExceptionFilter } from './core/filter/http-exception/http-exception.filter';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { TransformInterceptor } from './core/interceptor/transform/transform.interceptor';

async function bootstrap() {
  // 启动后端服务
  const app = await NestFactory.create(AppModule);
  // 设置全局路由前缀
  app.setGlobalPrefix('mangosteen');

  // 使用swagger配置api文档
  const config = new DocumentBuilder()
    .setTitle('Api文档')
    .setDescription('山竹记账的api文档')
    .setVersion('1.0')
    // .addTag('cats')
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    // ignoreGlobalPrefix: true,
  });
  SwaggerModule.setup('api', app, document);

  // 将错误请求过滤器注册到main.ts文件中
  app.useGlobalFilters(new HttpExceptionFilter());

  // 将成功请求拦截器注册到main.ts文件中
  app.useGlobalInterceptors(new TransformInterceptor());

  await app.listen(3000);
}

bootstrap();
