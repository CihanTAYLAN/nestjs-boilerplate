import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/database/prisma.module';
import { AuditLogInterceptor } from './audit-log.interceptor';
import { AuditLogService } from './audit-log.service';

@Module({
  imports: [PrismaModule],
  providers: [AuditLogService, AuditLogInterceptor],
  exports: [AuditLogService, AuditLogInterceptor],
})
export class AuditLogModule {}
