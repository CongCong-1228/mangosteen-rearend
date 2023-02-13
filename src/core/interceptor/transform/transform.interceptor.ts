import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

// 拦截成功的返回数据

// 快速创建拦截器指令========> nest g interceptor core/interceptor/transform
@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        return {
          data,
          msg: '请求成功',
          code: 0,
        };
      }),
    );
  }
}
