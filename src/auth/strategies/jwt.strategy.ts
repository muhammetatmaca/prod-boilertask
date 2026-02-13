import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
<<<<<<< HEAD
import { ExtractJwt, Strategy, StrategyOptionsWithoutRequest } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

export interface JwtPayload {
    sub: string; // UUID
    email: string;
    role: string;
=======
import {
  ExtractJwt,
  Strategy,
  StrategyOptionsWithoutRequest,
} from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

export interface JwtPayload {
  sub: string; // UUID
  email: string;
  role: string;
>>>>>>> 942d8da489735a8b7ecaa49c6c20563f43f51616
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
<<<<<<< HEAD
    constructor(configService: ConfigService) {
        const options: StrategyOptionsWithoutRequest = {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_ACCESS_SECRET') || 'fallback-secret',
        };
        super(options);
    }

    async validate(payload: JwtPayload) {
        return { userId: payload.sub, email: payload.email, role: payload.role };
    }
=======
  constructor(configService: ConfigService) {
    const options: StrategyOptionsWithoutRequest = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        configService.get<string>('JWT_ACCESS_SECRET') || 'fallback-secret',
    };
    super(options);
  }

  validate(payload: JwtPayload) {
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
>>>>>>> 942d8da489735a8b7ecaa49c6c20563f43f51616
}
