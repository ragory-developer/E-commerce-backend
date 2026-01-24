/**
 * AUTH SERVICE
 *
 * Contains all authentication business logic:
 * - Login (admin & customer)
 * - Register (customer)
 * - Create admin (superadmin only)
 * - Token management
 * - Password hashing
 * - Soft delete for admin management
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

// Define JWT payload interface locally
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
   * Admin Login
   */
  async adminLogin(dto: AdminLoginDto) {
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

    const adminPermissions = admin.permissions;

    const tokens = this.generateTokens({
      sub: admin.id,
      email: admin.email,
      userType: AuthUserType.ADMIN,
      role: admin.role,
      permissions: adminPermissions,
    });

    await this.saveRefreshToken(
      admin.id,
      AuthUserType.ADMIN,
      tokens.refreshToken,
    );

    await this.prisma.admin.update({
      where: { id: admin.id },
      data: { lastLoginAt: new Date() },
    });

    this.logger.log(`Admin logged in: ${admin.email}`);

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
   * Create Admin (SuperAdmin only)
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

    const admin = await this.prisma.admin.create({
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

    this.logger.log(`Admin created: ${admin.email} by ${currentUser.email}`);

    return {
      message: SUCCESS_MESSAGES.ADMIN_CREATED,
      data: admin,
    };
  }

  /**
   * Update Admin Permissions (SuperAdmin only)
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

    const updated = await this.prisma.admin.update({
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

    this.logger.log(
      `Admin permissions updated: ${admin.email} by ${currentUser.email}`,
    );

    return {
      message: 'Permissions updated successfully',
      data: updated,
    };
  }

  /**
   * Get All Admins (SuperAdmin only) - Excludes soft deleted
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
   * Disable Admin Account (SuperAdmin only) - Soft disable
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

    await this.prisma.admin.update({
      where: { id: adminId },
      data: { isActive: false },
    });

    await this.prisma.authToken.updateMany({
      where: { adminId, revoked: false },
      data: { revoked: true, revokedAt: new Date() },
    });

    this.logger.log(`Admin disabled: ${admin.email} by ${currentUser.email}`);

    return {
      message: 'Admin account disabled successfully',
      data: { adminId, email: admin.email },
    };
  }

  /**
   * Enable Admin Account (SuperAdmin only)
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

    await this.prisma.admin.update({
      where: { id: adminId },
      data: { isActive: true },
    });

    this.logger.log(`Admin enabled: ${admin.email} by ${currentUser.email}`);

    return {
      message: 'Admin account enabled successfully',
      data: { adminId, email: admin.email },
    };
  }

  /**
   * Soft Delete Admin (SuperAdmin only)
   * Sets isDeleted = true, NEVER actually deletes the record
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

    await this.prisma.admin.update({
      where: { id: adminId },
      data: {
        isDeleted: true,
        isActive: false,
        deletedAt: new Date(),
      },
    });

    await this.prisma.authToken.updateMany({
      where: { adminId },
      data: { revoked: true, revokedAt: new Date() },
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
   * Customer Registration
   */
  async customerRegister(dto: CustomerRegisterDto) {
    const existingPhone = await this.prisma.customer.findUnique({
      where: { phone: dto.phone },
    });

    if (existingPhone && !existingPhone.isGuest) {
      throw new ConflictException(ERROR_MESSAGES.PHONE_EXISTS);
    }

    if (dto.email) {
      const existingEmail = await this.prisma.customer.findUnique({
        where: { email: dto.email.toLowerCase() },
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
   * Customer Login
   */
  async customerLogin(dto: CustomerLoginDto) {
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
    );

    await this.prisma.customer.update({
      where: { id: customer.id },
      data: { lastLoginAt: new Date() },
    });

    this.logger.log(`Customer logged in: ${customer.phone}`);

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
   * Refresh Tokens - Soft revoke old token, generate new
   */
  async refreshTokens(refreshToken: string) {
    try {
      const payload = this.jwtService.verify<JwtTokenPayload>(refreshToken, {
        secret: this.configService.get<string>('jwt.secret'),
      });

      const storedToken = await this.prisma.authToken.findFirst({
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

      if (!storedToken) {
        throw new UnauthorizedException(ERROR_MESSAGES.TOKEN_INVALID);
      }

      await this.prisma.authToken.update({
        where: { id: storedToken.id },
        data: { revoked: true, revokedAt: new Date() },
      });

      const tokens = this.generateTokens({
        sub: payload.sub,
        email: payload.email,
        userType: payload.userType,
        role: payload.role,
        permissions: payload.permissions,
      });

      await this.saveRefreshToken(
        payload.sub,
        payload.userType,
        tokens.refreshToken,
      );

      return {
        message: 'Tokens refreshed successfully',
        data: tokens,
      };
    } catch {
      throw new UnauthorizedException(ERROR_MESSAGES.TOKEN_INVALID);
    }
  }

  /**
   * Logout - Soft revoke current session tokens
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
   * Logout All Sessions - Soft revoke all tokens
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
   * FIX: Use expiresIn as number (seconds)
   */
  private generateTokens(payload: JwtTokenPayload): TokenPair {
    // Convert payload to plain object for JWT signing
    const jwtPayload: Record<string, unknown> = {
      sub: payload.sub,
      email: payload.email,
      userType: payload.userType,
      role: payload.role,
      permissions: payload.permissions,
    };

    // Get expiry times and convert to seconds
    const accessExpiresStr =
      this.configService.get<string>('jwt.accessExpires') ?? '15m';
    const refreshExpiresStr =
      this.configService.get<string>('jwt.refreshExpires') ?? '7d';

    // Convert string time to seconds (number)
    const accessExpiresIn = this.parseTimeToSeconds(accessExpiresStr);
    const refreshExpiresIn = this.parseTimeToSeconds(refreshExpiresStr);

    const accessToken = this.jwtService.sign(jwtPayload, {
      expiresIn: accessExpiresIn,
    });

    const refreshToken = this.jwtService.sign(jwtPayload, {
      expiresIn: refreshExpiresIn,
    });

    return { accessToken, refreshToken };
  }

  /**
   * Parse time string to seconds
   * Examples: '15m' -> 900, '7d' -> 604800, '1h' -> 3600
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
   * Save Refresh Token to Database
   */
  private async saveRefreshToken(
    userId: string,
    userType: AuthUserType,
    refreshToken: string,
  ): Promise<void> {
    const tokenHash = await bcrypt.hash(refreshToken, 4);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.prisma.authToken.create({
      data: {
        userType,
        tokenHash,
        expiresAt,
        ...(userType === AuthUserType.ADMIN
          ? { adminId: userId }
          : { customerId: userId }),
      },
    });
  }
}
