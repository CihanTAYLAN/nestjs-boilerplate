import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ApiDocController } from './api-doc.controller';
import { ApiDocService } from './api-doc.service';
import { ApiDocAuthMiddleware } from './api-doc-auth.middleware';

@Module({
  controllers: [ApiDocController],
  providers: [ApiDocService],
  exports: [ApiDocService],
})
export class ApiDocModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ApiDocAuthMiddleware).forRoutes(ApiDocController);
  }
}
