import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

/** Minimal request shape needed by this strategy. */
interface RefreshRequest {
  body: { refreshToken: string };
}

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      secretOrKey: configService.get<string>('JWT_REFRESH_SECRET'),
      passReqToCallback: true,
    });
  }

  validate(req: RefreshRequest, payload: any) {
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      refreshToken: req.body.refreshToken,
    };
  }
}
