import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  APP_FILTER,
  APP_GUARD,
  APP_INTERCEPTOR,
  RouterModule,
} from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import ms from 'ms';
// Controllers
import { MainController } from './main.controller';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
// Guards, Filters, and Interceptors
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
// Configuration
import configuration from './config/configuration';
// Database
import { PrismaModule } from './database/prisma.module';
import { AuditLogInterceptor } from './modules/v1/common/audit-log/audit-log.interceptor';
import { AuditLogModule } from './modules/v1/common/audit-log/audit-log.module';
import { V1ApiModule } from './modules/api.module';
import { MainService } from './main.service';
import { RouteDefinitions } from './route-definitions';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),

    // Rate limiting
    ThrottlerModule.forRoot({
      throttlers: [
        {
          name: 'burst',
          ttl: ms('1 second'),
          limit: 20,
          blockDuration: ms('5 minutes'),
        }, // Burst defense 20RPS 5 minute block
        { name: 'minute', ttl: ms('1 minute'), limit: 300 }, // Minute limit 300RPM
        { name: 'hour', ttl: ms('1 hour'), limit: 5000 }, // Hour limit 5000RPH
        {
          name: 'day',
          ttl: ms('1 day'),
          limit: 10000,
          blockDuration: ms('24 hours'),
        }, // Day limit 10000RPD 24 hour block
      ],
      errorMessage: 'Too many requests. Please try again later.',
    }),

    // Database
    PrismaModule,
    V1ApiModule,
    AuditLogModule,
    RouterModule.register(RouteDefinitions),
  ],
  controllers: [MainController],
  providers: [
    MainService,
    // Global guards
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    // Global filters
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    // Global interceptors
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditLogInterceptor,
    },
  ],
})
export class MainModule {}
