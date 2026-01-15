import { Routes } from '@nestjs/core';
import { V1ApiModule } from './modules/api.module';
import { ApiDocModule } from './modules/v1/api-doc/api-doc.module';
import { CommonModule, } from './modules/v1/common/common.module';
import { AdminModule } from './modules/v1/admin/admin.module';
import { AppModule } from './modules/v1/app/app.module';
import { WebModule } from './modules/v1/app/web/web.module';
import { MobileModule } from './modules/v1/app/mobile/mobile.module';
import { AuthModule } from './modules/v1/common/auth/auth.module';
import { SystemListVariablesModule } from './modules/v1/common/system-list-variables/system-list-variables.module';
import { DashboardModule } from './modules/v1/admin/dashboard/dashboard.module';

export const RouteDefinitions: Routes = [
  {
    // Global prefix 'api' is already set in main.ts. Avoid duplicating it here.
    path: 'api',
    children: [
      {
        path: 'v1',
        module: V1ApiModule,
        children: [
          {
            path: 'doc',
            module: ApiDocModule,
          },
          {
            path: 'admin',
            module: AdminModule,
            children: [
              {
                path: 'dashboard',
                module: DashboardModule,
              },
            ],
          },
          {
            path: 'app',
            module: AppModule,
            children: [
              {
                path: 'web',
                module: WebModule,
              },
              {
                path: 'mobile',
                module: MobileModule,
              },
              {
                path: 'common',
                module: CommonModule,
              },
            ],
          },
          {
            path: 'common',
            module: CommonModule,
            children: [
              {
                path: 'auth',
                module: AuthModule,
              },
              {
                path: 'system-list-variables',
                module: SystemListVariablesModule,
              },
            ],
          },
        ]
      }
    ],
  },
];
