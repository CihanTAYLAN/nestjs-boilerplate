import { Module } from '@nestjs/common';
import { AuditLogModule } from './audit-log/audit-log.module';
import { CacheModule } from './cache/cache.module';
import { QueueCoreModule } from './queue/queue-core.module';
import { SystemListVariablesModule } from './system-list-variables/system-list-variables.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    CacheModule,
    QueueCoreModule,
    AuditLogModule,
    AuthModule,
    SystemListVariablesModule,
  ],
  exports: [
    CacheModule,
    QueueCoreModule,
    AuditLogModule,
    AuthModule,
    SystemListVariablesModule,
  ],
})
export class CommonModule {}
