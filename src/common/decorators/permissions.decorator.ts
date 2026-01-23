/**
 * PERMISSIONS GUARD
 *
 * Checks if the user has specific permissions.
 * More granular than roles - used for specific actions.
 * SUPERADMIN bypasses permission checks.
 *
 * EXAMPLE:
 *   @Permissions(Permission.MANAGE_PRODUCTS)
 *   @Post('products')
 *   createProduct() { ... }  // Only admins with MANAGE_PRODUCTS
 */

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Permission, Role } from '@prisma/client';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { ERROR_MESSAGES } from '../constants';
import { AuthenticatedUser } from '../interfaces';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Get required permissions from decorator
    const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    // No permissions required - allow access
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    // Get user from request
    const request = context.switchToHttp().getRequest();
    const user: AuthenticatedUser = request.user;

    // No user - deny access
    if (!user) {
      throw new ForbiddenException(ERROR_MESSAGES.FORBIDDEN);
    }

    // SUPERADMIN has ALL permissions
    if (user.role === Role.SUPERADMIN) {
      return true;
    }

    // Check if user has ALL required permissions
    if (!user.permissions || user.permissions.length === 0) {
      throw new ForbiddenException(ERROR_MESSAGES.FORBIDDEN);
    }

    const hasAllPermissions = requiredPermissions.every((permission) =>
      user.permissions.includes(permission),
    );

    if (!hasAllPermissions) {
      throw new ForbiddenException(ERROR_MESSAGES.FORBIDDEN);
    }

    return true;
  }
}
