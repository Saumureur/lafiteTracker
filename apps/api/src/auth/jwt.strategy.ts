import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(configService: ConfigService) {
    super({
      // On dit à NestJS de chercher le token dans le header "Authorization: Bearer ..."
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') as string,
    });
  }

  // Si le token est valide et non expiré, cette fonction est appelée
  async validate(payload: any) {
    // Ce qu'on retourne ici sera accessible via req.user dans nos contrôleurs
    return { username: payload.username, roles: payload.roles };
  }
}