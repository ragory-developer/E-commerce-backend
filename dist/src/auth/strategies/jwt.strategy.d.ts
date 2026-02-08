import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-jwt';
import { AuthUserType } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import type { AuthenticatedUser } from '../../common/interfaces';
interface JwtTokenPayload {
    sub: string;
    email: string;
    userType: AuthUserType;
    role?: string;
    permissions?: string[];
}
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private prisma;
    constructor(configService: ConfigService, prisma: PrismaService);
    validate(payload: JwtTokenPayload): Promise<AuthenticatedUser>;
}
export {};
