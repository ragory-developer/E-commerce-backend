/**
 * JWT STRATEGY
 *
 * This is how Passport.js verifies JWT tokens.
 *
 * HOW IT WORKS:
 * 1. Extract token from Authorization header
 * 2. Verify the token signature using JWT_SECRET
 * 3. If valid, call validate() method
 * 4. validate() returns the user data to attach to request
 */

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthUserType } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtPayload, AuthenticatedUser } from '../../common/interfaces';
import { ERROR_MESSAGES } from '../../common/constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      // Extract token from "Authorization: Bearer <token>" header
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // Don't ignore expiration - reject expired tokens
      ignoreExpiration: false,
      // Secret key for verification
      secretOrKey: configService.get<string>('jwt.secret'),
    });
  }

  /**
   * Called after token is verified.
   * Returns the user object that will be attached to request.user
   */
  async validate(payload: JwtPayload): Promise<AuthenticatedUser> {
    const { sub: userId, userType } = payload;

    // Validate Admin users
    if (userType === AuthUserType.ADMIN) {
      const admin = await this.prisma.admin.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          role: true,
          permissions: true,
          isActive: true,
          isDeleted: true,
        },
      });

      // Check if admin exists and is active
      if (!admin || admin.isDeleted || !admin.isActive) {
        throw new UnauthorizedException(ERROR_MESSAGES.USER_INACTIVE);
      }

      return {
        id: admin.id,
        email: admin.email,
        userType: AuthUserType.ADMIN,
        role: admin.role,
        permissions: admin.permissions,
      };
    }

    // Validate Customer users
    if (userType === AuthUserType.CUSTOMER) {
      const customer = await this.prisma.customer.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          phone: true,
          isActive: true,
          isDeleted: true,
        },
      });

      // Check if customer exists and is active
      if (!customer || customer.isDeleted || !customer.isActive) {
        throw new UnauthorizedException(ERROR_MESSAGES.USER_INACTIVE);
      }

      return {
        id: customer.id,
        email: customer.email || customer.phone,
        userType: AuthUserType.CUSTOMER,
      };
    }

    throw new UnauthorizedException(ERROR_MESSAGES.UNAUTHORIZED);
  }
}
