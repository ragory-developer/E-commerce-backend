/**
 * AUTH SERVICE - PRODUCTION READY V1
 *
 * Contains all authentication business logic with:
 * - Secure token management with hash verification
 * - Audit logging for sensitive operations
 * - Transaction support for data consistency
 * - IP address tracking
 * - Guest-to-full customer conversion
 */

import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  ForbiddenException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { AuthUserType, Permission, Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import {
  AdminLoginDto,
  CreateAdminDto,
  CustomerRegisterDto,
  CustomerLoginDto,
} from './dto';
import type { TokenPair, AuthenticatedUser } from '../common/interfaces';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../common/constants';

// JWT payload interface
interface JwtTokenPayload {
  sub: string;
  email: string;
  userType: AuthUserType;
  role?: Role;
  permissions?: Permission[];
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  // =========================================
  // ADMIN AUTHENTICATION
  // =========================================

  /**
   * Admin Login with IP tracking
   */
  async adminLogin(dto: AdminLoginDto, ipAddress?: string) {
    const admin = await this.prisma.admin.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (!admin) {
      throw new UnauthorizedException(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    if (admin.isDeleted || !admin.isActive) {
      throw new UnauthorizedException(ERROR_MESSAGES.USER_INACTIVE);
    }

    const isPasswordValid = await bcrypt.compare(dto.password, admin.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    const tokens = this.generateTokens({
      sub: admin.id,
      email: admin.email,
      userType: AuthUserType.ADMIN,
      role: admin.role,
      permissions: admin.permissions,
    });

    await this.saveRefreshToken(
      admin.id,
      AuthUserType.ADMIN,
      tokens.refreshToken,
      ipAddress,
    );

    // Update last login info
    await this.prisma.admin.update({
      where: { id: admin.id },
      data: {
        lastLoginAt: new Date(),
        lastLoginIp: ipAddress,
      },
    });

    this.logger.log(`Admin logged in: ${admin.email} from ${ipAddress}`);

    return {
      message: SUCCESS_MESSAGES.LOGIN_SUCCESS,
      data: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        user: {
          id: admin.id,
          email: admin.email,
          firstName: admin.firstName,
          lastName: admin.lastName,
          role: admin.role,
          permissions: admin.permissions,
        },
      },
    };
  }

  /**
   * Create Admin (SuperAdmin only) with Audit Logging
   */
  async createAdmin(dto: CreateAdminDto, currentUser: AuthenticatedUser) {
    if (currentUser.role !== Role.SUPERADMIN) {
      throw new ForbiddenException(ERROR_MESSAGES.ONLY_SUPERADMIN);
    }

    if (dto.role === Role.SUPERADMIN) {
      throw new ForbiddenException('Cannot create another SuperAdmin');
    }

    const existingAdmin = await this.prisma.admin.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (existingAdmin) {
      throw new ConflictException(ERROR_MESSAGES.EMAIL_EXISTS);
    }

    const saltRounds =
      this.configService.get<number>('security.bcryptRounds') ?? 12;
    const hashedPassword = await bcrypt.hash(dto.password, saltRounds);

    // Use transaction for data consistency
    const result = await this.prisma.$transaction(async (tx) => {
      const admin = await tx.admin.create({
        data: {
          firstName: dto.firstName,
          lastName: dto.lastName,
          email: dto.email.toLowerCase(),
          password: hashedPassword,
          phone: dto.phone,
          role: dto.role || Role.ADMIN,
          permissions: dto.permissions || [],
          createdBy: currentUser.id,
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          role: true,
          permissions: true,
          createdAt: true,
        },
      });

      // Create audit log
      await this.createAuditLog(tx, {
        actorRole: currentUser.role!,
        actorId: currentUser.id,
        action: 'CREATE_ADMIN',
        model: 'Admin',
        recordId: admin.id,
        newData: {
          email: admin.email,
          role: admin.role,
          permissions: admin.permissions,
        },
      });

      return admin;
    });

    this.logger.log(`Admin created: ${result.email} by ${currentUser.email}`);

    return {
      message: SUCCESS_MESSAGES.ADMIN_CREATED,
      data: result,
    };
  }

  /**
   * Update Admin Permissions with Audit Logging
   */
  async updateAdminPermissions(
    adminId: string,
    permissions: Permission[],
    currentUser: AuthenticatedUser,
  ) {
    if (currentUser.role !== Role.SUPERADMIN) {
      throw new ForbiddenException(ERROR_MESSAGES.ONLY_SUPERADMIN);
    }

    const admin = await this.prisma.admin.findFirst({
      where: { id: adminId, isDeleted: false },
    });

    if (!admin) {
      throw new BadRequestException(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    if (admin.role === Role.SUPERADMIN) {
      throw new ForbiddenException(ERROR_MESSAGES.CANNOT_MODIFY_SUPERADMIN);
    }

    const result = await this.prisma.$transaction(async (tx) => {
      const updated = await tx.admin.update({
        where: { id: adminId },
        data: {
          permissions: {
            set: permissions,
          },
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true,
          permissions: true,
        },
      });

      await this.createAuditLog(tx, {
        actorRole: currentUser.role!,
        actorId: currentUser.id,
        action: 'UPDATE_ADMIN_PERMISSIONS',
        model: 'Admin',
        recordId: adminId,
        oldData: { permissions: admin.permissions },
        newData: { permissions: updated.permissions },
      });

      return updated;
    });

    this.logger.log(
      `Admin permissions updated: ${admin.email} by ${currentUser.email}`,
    );

    return {
      message: 'Permissions updated successfully',
      data: result,
    };
  }

  /**
   * Get All Admins (SuperAdmin only)
   */
  async getAllAdmins(currentUser: AuthenticatedUser) {
    if (currentUser.role !== Role.SUPERADMIN) {
      throw new ForbiddenException(ERROR_MESSAGES.ONLY_SUPERADMIN);
    }

    const admins = await this.prisma.admin.findMany({
      where: { isDeleted: false },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        role: true,
        permissions: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return {
      message: 'Admins retrieved successfully',
      data: admins,
    };
  }

  /**
   * Disable Admin with Transaction
   */
  async disableAdmin(adminId: string, currentUser: AuthenticatedUser) {
    if (currentUser.role !== Role.SUPERADMIN) {
      throw new ForbiddenException(ERROR_MESSAGES.ONLY_SUPERADMIN);
    }

    const admin = await this.prisma.admin.findFirst({
      where: { id: adminId, isDeleted: false },
    });

    if (!admin) {
      throw new BadRequestException(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    if (admin.role === Role.SUPERADMIN) {
      throw new ForbiddenException(ERROR_MESSAGES.CANNOT_MODIFY_SUPERADMIN);
    }

    if (admin.id === currentUser.id) {
      throw new ForbiddenException('Cannot disable your own account');
    }

    // Use transaction for atomicity
    await this.prisma.$transaction(async (tx) => {
      await tx.admin.update({
        where: { id: adminId },
        data: { isActive: false },
      });

      await tx.authToken.updateMany({
        where: { adminId, revoked: false },
        data: { revoked: true, revokedAt: new Date() },
      });

      await this.createAuditLog(tx, {
        actorRole: currentUser.role!,
        actorId: currentUser.id,
        action: 'DISABLE_ADMIN',
        model: 'Admin',
        recordId: adminId,
        oldData: { isActive: true },
        newData: { isActive: false },
      });
    });

    this.logger.log(`Admin disabled: ${admin.email} by ${currentUser.email}`);

    return {
      message: 'Admin account disabled successfully',
      data: { adminId, email: admin.email },
    };
  }

  /**
   * Enable Admin
   */
  async enableAdmin(adminId: string, currentUser: AuthenticatedUser) {
    if (currentUser.role !== Role.SUPERADMIN) {
      throw new ForbiddenException(ERROR_MESSAGES.ONLY_SUPERADMIN);
    }

    const admin = await this.prisma.admin.findFirst({
      where: { id: adminId, isDeleted: false },
    });

    if (!admin) {
      throw new BadRequestException(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.admin.update({
        where: { id: adminId },
        data: { isActive: true },
      });

      await this.createAuditLog(tx, {
        actorRole: currentUser.role!,
        actorId: currentUser.id,
        action: 'ENABLE_ADMIN',
        model: 'Admin',
        recordId: adminId,
        oldData: { isActive: false },
        newData: { isActive: true },
      });
    });

    this.logger.log(`Admin enabled: ${admin.email} by ${currentUser.email}`);

    return {
      message: 'Admin account enabled successfully',
      data: { adminId, email: admin.email },
    };
  }

  /**
   * Soft Delete Admin with Transaction
   */
  async deleteAdmin(adminId: string, currentUser: AuthenticatedUser) {
    if (currentUser.role !== Role.SUPERADMIN) {
      throw new ForbiddenException(ERROR_MESSAGES.ONLY_SUPERADMIN);
    }

    const admin = await this.prisma.admin.findFirst({
      where: { id: adminId, isDeleted: false },
    });

    if (!admin) {
      throw new BadRequestException(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    if (admin.role === Role.SUPERADMIN) {
      throw new ForbiddenException(ERROR_MESSAGES.CANNOT_MODIFY_SUPERADMIN);
    }

    if (admin.id === currentUser.id) {
      throw new ForbiddenException('Cannot delete your own account');
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.admin.update({
        where: { id: adminId },
        data: {
          isDeleted: true,
          isActive: false,
          deletedAt: new Date(),
        },
      });

      await tx.authToken.updateMany({
        where: { adminId },
        data: { revoked: true, revokedAt: new Date() },
      });

      await this.createAuditLog(tx, {
        actorRole: currentUser.role!,
        actorId: currentUser.id,
        action: 'DELETE_ADMIN',
        model: 'Admin',
        recordId: adminId,
        oldData: {
          email: admin.email,
          isActive: admin.isActive,
          isDeleted: false,
        },
        newData: {
          isDeleted: true,
          isActive: false,
        },
      });
    });

    this.logger.log(
      `Admin soft deleted: ${admin.email} by ${currentUser.email}`,
    );

    return {
      message: 'Admin account deleted successfully',
      data: { adminId, email: admin.email },
    };
  }

  // =========================================
  // CUSTOMER AUTHENTICATION
  // =========================================

  /**
   * Customer Registration with Guest Conversion
   */
  async customerRegister(dto: CustomerRegisterDto) {
    const existingPhone = await this.prisma.customer.findUnique({
      where: { phone: dto.phone },
    });

    if (existingPhone && !existingPhone.isGuest) {
      throw new ConflictException(ERROR_MESSAGES.PHONE_EXISTS);
    }

    // Check email uniqueness (including for guest conversion)
    if (dto.email) {
      const existingEmail = await this.prisma.customer.findFirst({
        where: {
          email: dto.email.toLowerCase(),
          // Exclude current guest if converting
          ...(existingPhone?.isGuest ? { id: { not: existingPhone.id } } : {}),
        },
      });

      if (existingEmail) {
        throw new ConflictException(ERROR_MESSAGES.EMAIL_EXISTS);
      }
    }

    let hashedPassword: string | null = null;
    if (dto.password) {
      const saltRounds =
        this.configService.get<number>('security.bcryptRounds') ?? 12;
      hashedPassword = await bcrypt.hash(dto.password, saltRounds);
    }

    let customer;

    // Convert guest to full account
    if (existingPhone && existingPhone.isGuest) {
      customer = await this.prisma.customer.update({
        where: { id: existingPhone.id },
        data: {
          email: dto.email?.toLowerCase(),
          password: hashedPassword,
          firstName: dto.firstName,
          lastName: dto.lastName,
          isGuest: !dto.password,
        },
      });
    } else {
      // Create new customer
      customer = await this.prisma.customer.create({
        data: {
          phone: dto.phone,
          email: dto.email?.toLowerCase(),
          password: hashedPassword,
          firstName: dto.firstName,
          lastName: dto.lastName,
          addresses: [],
          isGuest: !dto.password,
        },
      });
    }

    const tokens = this.generateTokens({
      sub: customer.id,
      email: customer.email || customer.phone,
      userType: AuthUserType.CUSTOMER,
    });

    await this.saveRefreshToken(
      customer.id,
      AuthUserType.CUSTOMER,
      tokens.refreshToken,
    );

    this.logger.log(`Customer registered: ${customer.phone}`);

    return {
      message: SUCCESS_MESSAGES.REGISTER_SUCCESS,
      data: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        user: {
          id: customer.id,
          email: customer.email,
          phone: customer.phone,
          firstName: customer.firstName,
          lastName: customer.lastName,
          isGuest: customer.isGuest,
        },
      },
    };
  }

  /**
   * Customer Login with IP tracking
   */
  async customerLogin(dto: CustomerLoginDto, ipAddress?: string) {
    let customer;

    if (dto.email) {
      customer = await this.prisma.customer.findUnique({
        where: { email: dto.email.toLowerCase() },
      });
    } else if (dto.phone) {
      customer = await this.prisma.customer.findUnique({
        where: { phone: dto.phone },
      });
    }

    if (!customer) {
      throw new UnauthorizedException(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    if (customer.isDeleted || !customer.isActive) {
      throw new UnauthorizedException(ERROR_MESSAGES.USER_INACTIVE);
    }

    if (!customer.password) {
      throw new UnauthorizedException(
        'Please complete registration by setting a password',
      );
    }

    const isPasswordValid = await bcrypt.compare(
      dto.password,
      customer.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    const tokens = this.generateTokens({
      sub: customer.id,
      email: customer.email || customer.phone,
      userType: AuthUserType.CUSTOMER,
    });

    await this.saveRefreshToken(
      customer.id,
      AuthUserType.CUSTOMER,
      tokens.refreshToken,
      ipAddress,
    );

    // Update last login info
    await this.prisma.customer.update({
      where: { id: customer.id },
      data: {
        lastLoginAt: new Date(),
        lastLoginIp: ipAddress,
      },
    });

    this.logger.log(`Customer logged in: ${customer.phone} from ${ipAddress}`);

    return {
      message: SUCCESS_MESSAGES.LOGIN_SUCCESS,
      data: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        user: {
          id: customer.id,
          email: customer.email,
          phone: customer.phone,
          firstName: customer.firstName,
          lastName: customer.lastName,
        },
      },
    };
  }

  // =========================================
  // TOKEN MANAGEMENT
  // =========================================

  /**
   * Refresh Tokens with Hash Verification (SECURITY FIX)
   */
  // async refreshTokens(refreshToken: string) {
  //   try {
  //     const payload = this.jwtService.verify<JwtTokenPayload>(refreshToken, {
  //       secret: this.configService.get<string>('jwt.secret'),
  //     });

  //     // Find all non-revoked tokens for this user
  //     const storedTokens = await this.prisma.authToken.findMany({
  //       where: {
  //         userType: payload.userType,
  //         revoked: false,
  //         expiresAt: { gt: new Date() },
  //         ...(payload.userType === AuthUserType.ADMIN
  //           ? { adminId: payload.sub }
  //           : { customerId: payload.sub }),
  //       },
  //       orderBy: { createdAt: 'desc' },
  //     });

  //     // CRITICAL: Verify the refresh token hash matches
  //     let validToken = null;
  //     for (const token of storedTokens) {
  //       const isValid = await bcrypt.compare(refreshToken, token.tokenHash);
  //       if (isValid) {
  //         validToken = token;
  //         break;
  //       }
  //     }

  //     if (!validToken) {
  //       throw new UnauthorizedException(ERROR_MESSAGES.TOKEN_INVALID);
  //     }

  //     // Revoke old token
  //     await this.prisma.authToken.update({
  //       where: { id: validToken.id },
  //       data: { revoked: true, revokedAt: new Date() },
  //     });

  //     // Generate new tokens
  //     const tokens = this.generateTokens({
  //       sub: payload.sub,
  //       email: payload.email,
  //       userType: payload.userType,
  //       role: payload.role,
  //       permissions: payload.permissions,
  //     });

  //     // Save new refresh token
  //     await this.saveRefreshToken(
  //       payload.sub,
  //       payload.userType,
  //       tokens.refreshToken,
  //     );

  //     return {
  //       message: 'Tokens refreshed successfully',
  //       data: tokens,
  //     };
  //   } catch (error) {
  //     if (error instanceof UnauthorizedException) {
  //       throw error;
  //     }
  //     throw new UnauthorizedException(ERROR_MESSAGES.TOKEN_INVALID);
  //   }
  // }
  async refreshTokens(refreshToken: string) {
    try {
      // 1️⃣ Verify JWT signature & extract payload
      const payload = this.jwtService.verify<JwtTokenPayload>(refreshToken, {
        secret: this.configService.get<string>('jwt.secret'),
      });

      // 2️⃣ Load all active (non-revoked, non-expired) tokens for this user
      const storedTokens = await this.prisma.authToken.findMany({
        where: {
          userType: payload.userType,
          revoked: false,
          expiresAt: { gt: new Date() },
          ...(payload.userType === AuthUserType.ADMIN
            ? { adminId: payload.sub }
            : { customerId: payload.sub }),
        },
        orderBy: { createdAt: 'desc' },
      });

      // 3️⃣ Find matching refresh token by bcrypt hash comparison
      let validToken: (typeof storedTokens)[number] | null = null;

      for (const token of storedTokens) {
        const isValid = await bcrypt.compare(refreshToken, token.tokenHash);
        if (isValid) {
          validToken = token;
          break;
        }
      }

      if (!validToken) {
        throw new UnauthorizedException(ERROR_MESSAGES.TOKEN_INVALID);
      }

      // 4️⃣ Revoke the old refresh token (rotation)
      await this.prisma.authToken.update({
        where: { id: validToken.id },
        data: {
          revoked: true,
          revokedAt: new Date(),
        },
      });

      // 5️⃣ Generate new access & refresh tokens
      const tokens = this.generateTokens({
        sub: payload.sub,
        email: payload.email,
        userType: payload.userType,
        role: payload.role,
        permissions: payload.permissions,
      });

      // 6️⃣ Store the new refresh token (hashed)
      await this.saveRefreshToken(
        payload.sub,
        payload.userType,
        tokens.refreshToken,
      );

      return {
        message: 'Tokens refreshed successfully',
        data: tokens,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException(ERROR_MESSAGES.TOKEN_INVALID);
    }
  }

  /**
   * Logout current session
   */
  async logout(userId: string, userType: AuthUserType) {
    await this.prisma.authToken.updateMany({
      where: {
        userType,
        revoked: false,
        ...(userType === AuthUserType.ADMIN
          ? { adminId: userId }
          : { customerId: userId }),
      },
      data: { revoked: true, revokedAt: new Date() },
    });

    this.logger.log(`User logged out: ${userId}`);

    return {
      message: SUCCESS_MESSAGES.LOGOUT_SUCCESS,
    };
  }

  /**
   * Logout all sessions
   */
  async logoutAll(userId: string, userType: AuthUserType) {
    await this.prisma.authToken.updateMany({
      where: {
        userType,
        ...(userType === AuthUserType.ADMIN
          ? { adminId: userId }
          : { customerId: userId }),
      },
      data: { revoked: true, revokedAt: new Date() },
    });

    this.logger.log(`All sessions logged out: ${userId}`);

    return {
      message: 'All sessions logged out successfully',
    };
  }

  // =========================================
  // HELPER METHODS
  // =========================================

  /**
   * Generate Access & Refresh Tokens
   */
  private generateTokens(payload: JwtTokenPayload): TokenPair {
    const accessExpiresStr =
      this.configService.get<string>('jwt.accessExpires') ?? '15m';
    const refreshExpiresStr =
      this.configService.get<string>('jwt.refreshExpires') ?? '7d';

    const accessExpiresIn = this.parseTimeToSeconds(accessExpiresStr);
    const refreshExpiresIn = this.parseTimeToSeconds(refreshExpiresStr);

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: accessExpiresIn,
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: refreshExpiresIn,
    });

    return { accessToken, refreshToken };
  }

  /**
   * Parse time string to seconds
   */
  private parseTimeToSeconds(time: string): number {
    const match = time.match(/^(\d+)([smhd])$/);
    if (!match) {
      return 900; // Default 15 minutes
    }

    const value = parseInt(match[1], 10);
    const unit = match[2];

    switch (unit) {
      case 's':
        return value;
      case 'm':
        return value * 60;
      case 'h':
        return value * 60 * 60;
      case 'd':
        return value * 60 * 60 * 24;
      default:
        return 900;
    }
  }

  /**
   * Save Refresh Token with proper salt rounds
   */
  private async saveRefreshToken(
    userId: string,
    userType: AuthUserType,
    refreshToken: string,
    ipAddress?: string,
  ): Promise<void> {
    // Use proper salt rounds from config
    const saltRounds =
      this.configService.get<number>('security.bcryptRounds') ?? 12;
    const tokenHash = await bcrypt.hash(refreshToken, saltRounds);

    // Calculate expiry date
    const refreshExpiresDays =
      this.parseTimeToSeconds(
        this.configService.get<string>('jwt.refreshExpires') ?? '7d',
      ) /
      (60 * 60 * 24);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + refreshExpiresDays);

    await this.prisma.authToken.create({
      data: {
        userType,
        tokenHash,
        expiresAt,
        ipAddress,
        ...(userType === AuthUserType.ADMIN
          ? { adminId: userId }
          : { customerId: userId }),
      },
    });
  }

  /**
   * Create Audit Log Entry
   */
  private async createAuditLog(
    tx: any,
    params: {
      actorRole: Role;
      actorId: string;
      action: string;
      model: string;
      recordId?: string;
      oldData?: any;
      newData?: any;
    },
  ) {
    try {
      await tx.auditLog.create({
        data: {
          actorRole: params.actorRole,
          actorId: params.actorId,
          action: params.action,
          model: params.model,
          recordId: params.recordId,
          oldData: params.oldData,
          newData: params.newData,
        },
      });
    } catch (error) {
      // Don't fail main operation if audit logging fails
      this.logger.error('Failed to create audit log', error);
    }
  }
}
