import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtAccessGuard } from 'src/common/guards/jwt-access.guard';
import { JwtAccessStrategy } from 'src/common/guards/jwt-access.strategy';
import { JwtRefreshGuard } from 'src/common/guards/jwt-refresh.guard';
import { JwtRefreshStrategy } from 'src/common/guards/jwt-refresh.strategy';
import { PrismaModule } from 'src/database/prisma.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret:
          configService.get('JWT_SECRET') ||
          'your-secret-key-change-in-production',
        signOptions: {
          expiresIn: '8h',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtAccessStrategy,
    JwtRefreshStrategy,
    JwtAccessGuard,
    JwtRefreshGuard,
  ],
  exports: [AuthService],
})
export class AuthModule {}
