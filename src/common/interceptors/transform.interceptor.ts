import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SKIP_TRANSFORM_KEY } from '../decorators/skip-transform.decorator';

export type Response<T> = {};

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T> | T>
{
  constructor(private reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T> | T> {
    const skipTransform = this.reflector.getAllAndOverride<boolean>(
      SKIP_TRANSFORM_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (skipTransform) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();
    const startTime = Date.now();

    return next.handle().pipe(
      map((data) => {
        const responseTime = Date.now() - startTime;
        return {
          success: true,
          statusCode: 200,
          data,
          message: 'Success',
          timestamp: new Date().toISOString(),
          path: request.url,
          responseTime,
        };
      }),
    );
  }
}
