import { Injectable, type NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import basicAuth from 'basic-auth';
import { Request, Response } from 'express';

@Injectable()
export class ApiDocMiddleware implements NestMiddleware {
  constructor(private configService: ConfigService) {}
  async use(
    req: Request,
    res: Response,
    next: (err?: any) => void, // Accept error parameter
  ) {
    // if (this.configService.get('app.env') !== 'development' && this.configService.get('app.env') !== 'staging') {
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
        return; // Stop here; don't call next() after responding
      }
    // }
    next();
  }
}
