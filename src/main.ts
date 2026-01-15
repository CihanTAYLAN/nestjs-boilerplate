import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import basicAuth from 'basic-auth';
import * as express from 'express';
import hbs from 'hbs';
import { MainModule } from './main.module';
import { ApiDocService } from './modules/v1/api-doc/api-doc.service';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(MainModule);

  const configService = app.get(ConfigService);

  // Configure templates
  app.setBaseViewsDir(join(__dirname, 'modules', 'v1', 'api-doc', 'templates'));
  app.setViewEngine('hbs');

  // Register Handlebars helpers
  hbs.registerHelper('eq', (a, b) => a === b);
  hbs.registerHelper('toUpperCase', (str: string) =>
    str ? str.toUpperCase() : '',
  );

  // Enable CORS
  app.enableCors({
    origin: configService.get('app.cors'),
    credentials: true,
  });

  // Validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Silence Chrome DevTools well-known probe to avoid noisy 404 logs
  const expressApp = (app.getHttpAdapter() as any).getInstance();
  expressApp.get(
    '/.well-known/appspecific/com.chrome.devtools.json',
    (_req: any, res: any) => {
      res.status(204).end();
    },
  );

  const port = configService.get('app.port');
  const appUrl = configService.get('app.url');

  // Protect public API doc assets with basic auth
  const apiDocAuthMiddleware = (req: any, res: any, next: any) => {
    const credentials = basicAuth(req);
    if (
      !credentials ||
      credentials.name !== configService.get('documentation.user') ||
      credentials.pass !== configService.get('documentation.password')
    ) {
      res.setHeader('WWW-Authenticate', 'Basic');
      res.statusCode = 401;
      res.end('Unauthorized');
      return;
    }
    next();
  };
  app.use('/public/api-doc', apiDocAuthMiddleware);
  app.use('/public/doc', apiDocAuthMiddleware);

  // Initialize API documentation service with app instance
  const apiDocService = app.get(ApiDocService);
  apiDocService.setApp(app);

  // Serve static files
  const apiDocStaticCandidates = [
    join(__dirname, 'public'),
    join(__dirname, '..', 'src', 'public'),
  ];
  const apiDocStaticPath = apiDocStaticCandidates.find((candidate) =>
    existsSync(candidate),
  );

  if (apiDocStaticPath) {
    app.use('/public', express.static(apiDocStaticPath));
  }

  await app.listen(port, '0.0.0.0');

  console.log(`
    🚀 Application is running on: ${appUrl}
    📚 API Documentation: ${appUrl}/api/v1/doc
  `);

  // Signal handlers for graceful shutdown
  process.on('SIGINT', async () => {
    console.log('🛑 Received SIGINT. Graceful shutdown...');
    await app.close();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    console.log('🛑 Received SIGTERM. Graceful shutdown...');
    await app.close();
    process.exit(0);
  });
}

bootstrap();
