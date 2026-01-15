import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/database/prisma.module';
import { CacheModule } from '../cache/cache.module';
import { SystemListVariablesController } from './system-list-variables.controller';
import { SystemListVariablesService } from './system-list-variables.service';

@Module({
  imports: [PrismaModule, CacheModule],
  controllers: [SystemListVariablesController],
  providers: [SystemListVariablesService],
  exports: [SystemListVariablesService],
})
export class SystemListVariablesModule {}
