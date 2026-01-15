import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { MobileModule } from './mobile/mobile.module';
import { WebModule } from './web/web.module';

@Module({
  imports: [WebModule, MobileModule, CommonModule],
})
export class AppModule {}
