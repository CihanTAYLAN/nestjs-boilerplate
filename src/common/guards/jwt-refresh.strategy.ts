import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../database/prisma.service';
import { JwtPayload, JwtPurpose } from './jwt-payload.interface';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'JwtRefresh',
) {
  constructor(
    configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        configService.get('JWT_SECRET') ||
        'your-secret-key-change-in-production',
    });
  }

  async validate(payload: JwtPayload): Promise<JwtPayload> {
    // Only allow REFRESH tokens
    if (payload.purpose !== JwtPurpose.REFRESH) {
      throw new UnauthorizedException('Invalid token type for this endpoint');
    }

    // Validate user still exists (for security)
    await this.prisma.user
      .findUniqueOrThrow({
        where: { id: payload.sub },
        select: { id: true },
      })
      .catch(() => {
        throw new UnauthorizedException();
      });

    return {
      sub: payload.sub,
      purpose: payload.purpose,
      email: payload.email,
      firstName: payload.firstName,
      lastName: payload.lastName,
      iat: payload.iat,
      exp: payload.exp,
      jti: payload.jti,
    };
  }
}
