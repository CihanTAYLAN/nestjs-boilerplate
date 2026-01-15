import { Module } from '@nestjs/common';
import { ApiDocModule } from './v1/api-doc/api-doc.module';
import { AppModule } from './v1/app/app.module';
import { CommonModule } from './v1/common/common.module';
import { AdminModule } from './v1/admin/admin.module';

@Module({
  imports: [
    ApiDocModule,
    AdminModule,
    AppModule,
    CommonModule,
  ],
})
export class V1ApiModule {}
