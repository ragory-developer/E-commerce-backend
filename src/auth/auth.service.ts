/**
 * AUTH SERVICE
 *
 * Contains all authentication business logic:
 * - Login (admin & customer)
 * - Register (customer)
 * - Create admin (superadmin only)
 * - Token management
 * - Password hashing
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
import { JwtPayload, TokenPair, AuthenticatedUser } from '../common/interfaces';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../common/constants';

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
   *
   * 1. Find admin by email
   * 2.  Verify password
   * 3. Generate tokens
   * 4. Save refresh token to database
   * 5. Return tokens and user info
   */
  async adminLogin(dto: AdminLoginDto) {
    // Find admin by email (case-insensitive)
    const admin = await this.prisma.admin.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    // Admin not found
    if (!admin) {
      throw new UnauthorizedException(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    // Check if admin is active
    if (admin.isDeleted || !admin.isActive) {
      throw new UnauthorizedException(ERROR_MESSAGES.USER_INACTIVE);
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(dto.password, admin.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    // Generate tokens
    const tokens = await this.generateTokens({
      sub: admin.id,
      email: admin.email,
      userType: AuthUserType.ADMIN,
      role: admin.role,
      permissions: admin.permissions,
    });

    // Save refresh token
    await this.saveRefreshToken(
      admin.id,
      AuthUserType.ADMIN,
      tokens.refreshToken,
    );

    // Update last login
    await this.prisma.admin.update({
      where: { id: admin.id },
      data: { lastLoginAt: new Date() },
    });

    this.logger.log(`Admin logged in:  ${admin.email}`);

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
   *
   * Only SUPERADMIN can create new admins.
   * Cannot create another SUPERADMIN.
   */
  async createAdmin(dto: CreateAdminDto, currentUser: AuthenticatedUser) {
    // Only SUPERADMIN can create admins
    if (currentUser.role !== Role.SUPERADMIN) {
      throw new ForbiddenException(ERROR_MESSAGES.ONLY_SUPERADMIN);
    }

    // Cannot create another SUPERADMIN
    if (dto.role === Role.SUPERADMIN) {
      throw new ForbiddenException('Cannot create another SuperAdmin');
    }

    // Check if email already exists
    const existingAdmin = await this.prisma.admin.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (existingAdmin) {
      throw new ConflictException(ERROR_MESSAGES.EMAIL_EXISTS);
    }

    // Hash password
    const saltRounds = this.configService.get<number>('security.bcryptRounds');
    const hashedPassword = await bcrypt.hash(dto.password, saltRounds);

    // Create admin
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
    // Only SUPERADMIN can update permissions
    if (currentUser.role !== Role.SUPERADMIN) {
      throw new ForbiddenException(ERROR_MESSAGES.ONLY_SUPERADMIN);
    }

    // Find admin
    const admin = await this.prisma.admin.findUnique({
      where: { id: adminId },
    });

    if (!admin) {
      throw new BadRequestException(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    // Cannot modify SUPERADMIN
    if (admin.role === Role.SUPERADMIN) {
      throw new ForbiddenException(ERROR_MESSAGES.CANNOT_MODIFY_SUPERADMIN);
    }

    // Update permissions
    const updated = await this.prisma.admin.update({
      where: { id: adminId },
      data: { permissions },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        permissions: true,
      },
    });

    return {
      message: 'Permissions updated successfully',
      data: updated,
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

  // =========================================
  // CUSTOMER AUTHENTICATION
  // =========================================

  /**
   * Customer Registration
   *
   * 1. Check if phone/email already exists
   * 2. Hash password (if provided)
   * 3. Create customer
   * 4. Generate tokens
   * 5. Return tokens and user info
   */
  async customerRegister(dto: CustomerRegisterDto) {
    // Check if phone exists
    const existingPhone = await this.prisma.customer.findUnique({
      where: { phone: dto.phone },
    });

    if (existingPhone && !existingPhone.isGuest) {
      throw new ConflictException(ERROR_MESSAGES.PHONE_EXISTS);
    }

    // Check if email exists (if provided)
    if (dto.email) {
      const existingEmail = await this.prisma.customer.findUnique({
        where: { email: dto.email.toLowerCase() },
      });

      if (existingEmail) {
        throw new ConflictException(ERROR_MESSAGES.EMAIL_EXISTS);
      }
    }

    // Hash password if provided
    let hashedPassword: string | null = null;
    if (dto.password) {
      const saltRounds = this.configService.get<number>(
        'security.bcryptRounds',
      );
      hashedPassword = await bcrypt.hash(dto.password, saltRounds);
    }

    // Create or update customer (upgrade guest to registered)
    let customer;

    if (existingPhone && existingPhone.isGuest) {
      // Upgrade existing guest
      customer = await this.prisma.customer.update({
        where: { id: existingPhone.id },
        data: {
          email: dto.email?.toLowerCase(),
          password: hashedPassword,
          firstName: dto.firstName,
          lastName: dto.lastName,
          isGuest: !dto.password, // If password provided, not a guest
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

    // Generate tokens
    const tokens = await this.generateTokens({
      sub: customer.id,
      email: customer.email || customer.phone,
      userType: AuthUserType.CUSTOMER,
    });

    // Save refresh token
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
    // Find customer by email or phone
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

    // Check if customer has password (not guest)
    if (!customer.password) {
      throw new UnauthorizedException(
        'Please complete registration by setting a password',
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(
      dto.password,
      customer.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    // Generate tokens
    const tokens = await this.generateTokens({
      sub: customer.id,
      email: customer.email || customer.phone,
      userType: AuthUserType.CUSTOMER,
    });

    // Save refresh token
    await this.saveRefreshToken(
      customer.id,
      AuthUserType.CUSTOMER,
      tokens.refreshToken,
    );

    // Update last login
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
   * Refresh Tokens
   *
   * Exchange a valid refresh token for new access & refresh tokens.
   */
  async refreshTokens(refreshToken: string) {
    try {
      // Verify refresh token
      const payload = this.jwtService.verify<JwtPayload>(refreshToken, {
        secret: this.configService.get<string>('jwt.secret'),
      });

      // Find the stored token
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

      // Revoke old token
      await this.prisma.authToken.update({
        where: { id: storedToken.id },
        data: { revoked: true, revokedAt: new Date() },
      });

      // Generate new tokens
      const tokens = await this.generateTokens({
        sub: payload.sub,
        email: payload.email,
        userType: payload.userType,
        role: payload.role,
        permissions: payload.permissions,
      });

      // Save new refresh token
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
      throw new UnauthorizedException(ERROR_MESSAGES.TOKEN_INVALID);
    }
  }

  /**
   * Logout - Revoke current session
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
   * Logout All Sessions
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
  private async generateTokens(payload: JwtPayload): Promise<TokenPair> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: this.configService.get<string>('jwt.accessExpires'),
      }),
      this.jwtService.signAsync(payload, {
        expiresIn: this.configService.get<string>('jwt.refreshExpires'),
      }),
    ]);

    return { accessToken, refreshToken };
  }

  /**
   * Save Refresh Token to Database
   */
  private async saveRefreshToken(
    userId: string,
    userType: AuthUserType,
    refreshToken: string,
  ): Promise<void> {
    // Hash the token before storing
    const tokenHash = await bcrypt.hash(refreshToken, 4);

    // Calculate expiry date
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

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
