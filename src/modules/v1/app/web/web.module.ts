import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/database/prisma.module';
import { WebController } from './web.controller';
import { WebService } from './web.service';

@Module({
  imports: [PrismaModule],
  controllers: [WebController],
  providers: [WebService],
  exports: [WebService],
})
export class WebModule {}
