import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../database/prisma.service';
import { JwtPayload, JwtPurpose } from './jwt-payload.interface';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, 'JwtAccess') {
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
    // Only allow ACCESS tokens
    if (payload.purpose !== JwtPurpose.ACCESS) {
      throw new UnauthorizedException('Invalid token type for this endpoint');
    }

    // Validate user exists
    const user = await this.prisma.user
      .findUniqueOrThrow({
        where: { id: payload.sub },
      })
      .catch(() => {
        throw new UnauthorizedException();
      });

    return {
      sub: user.id,
      purpose: payload.purpose,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      iat: payload.iat,
      exp: payload.exp,
      jti: payload.jti,
    };
  }
}
