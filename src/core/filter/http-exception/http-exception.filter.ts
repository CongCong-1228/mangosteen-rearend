import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';

// 接口格式统一之拦截错误请求，最后注册到main.ts文件中

// 快捷创建指令 nest g filter core/filter/http-exception

@Catch(HttpException)
export class HttpExceptionFilter<T> implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp(); // 获取请求上下文
    const response = ctx.getResponse(); // 获取请求上下文中的response对象
    const status = exception.getStatus(); // 获取异常状态码

    // 设置错误信息

    const message = exception.message
      ? exception.message
      : `${status >= 500 ? 'Service Error' : 'Client Error'}`;

    const errorResponse = {
      data: {},
      message,
      code: -1,
    };

    // 设置返回的状态码，请求头，发送错误信息

    response.status(status);
    response.header('Content-type', 'application/json; charset=utf-8');
    response.send(errorResponse);
  }
}
