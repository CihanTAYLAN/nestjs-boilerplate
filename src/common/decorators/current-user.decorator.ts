import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

export const CurrentUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    let user = request.user;

    const token = request.headers.authorization;

    if (token && !user) {
      // token decode and return user
      try {
        user = jwt.decode(token.replace('Bearer ', ''));
      } catch (_) {
        // console.error('Error decoding token:', error);
      }
    }

    return data ? user?.[data] : user;
  },
);
