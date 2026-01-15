import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import basicAuth from 'basic-auth';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class ApiDocAuthMiddleware implements NestMiddleware {
  constructor(private configService: ConfigService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const credentials = basicAuth(req);

    if (
      !credentials ||
      credentials.name !== this.configService.get('documentation.user') ||
      credentials.pass !== this.configService.get('documentation.password')
    ) {
      res.setHeader('WWW-Authenticate', 'Basic');
      res.statusCode = 401;
      res.end(
        JSON.stringify({
          success: false,
          statusCode: 401,
          data: null,
          message: 'Unauthorized',
          details: ['Invalid credentials'],
        }),
      );
      return;
    }
    next();
  }
}
