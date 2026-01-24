/**
 * AUTH CONTROLLER
 *
 * All authentication API endpoints
 */

import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Patch,
  Param,
  Get,
  Delete,
} from '@nestjs/common';
import { Permission, Role } from '@prisma/client';
import { AuthService } from './auth.service';
import {
  AdminLoginDto,
  CreateAdminDto,
  CustomerRegisterDto,
  CustomerLoginDto,
  RefreshTokenDto,
} from './dto';
import { Public } from '../common/decorators/public.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
// Use 'import type' to fix decorator metadata issue
import type { AuthenticatedUser } from '../common/interfaces';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@ApiBearerAuth('access-token')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // =========================================
  // ADMIN ENDPOINTS
  // =========================================

  /**
   * POST /api/v1/auth/admin/login
   * Admin login - returns JWT tokens
   */
  @Public()
  @Post('admin/login')
  @HttpCode(HttpStatus.OK)
  adminLogin(@Body() dto: AdminLoginDto) {
    return this.authService.adminLogin(dto);
  }

  /**
   * POST /api/v1/auth/admin/create
   * Create new admin (SuperAdmin only)
   */
  @Roles(Role.SUPERADMIN)
  @Post('admin/create')
  createAdmin(
    @Body() dto: CreateAdminDto,
    @CurrentUser() currentUser: AuthenticatedUser,
  ) {
    return this.authService.createAdmin(dto, currentUser);
  }

  /**
   * GET /api/v1/auth/admin/list
   * Get all admins (SuperAdmin only)
   */
  @Roles(Role.SUPERADMIN)
  @Get('admin/list')
  getAllAdmins(@CurrentUser() currentUser: AuthenticatedUser) {
    return this.authService.getAllAdmins(currentUser);
  }

  /**
   * PATCH /api/v1/auth/admin/:adminId/permissions
   * Update admin permissions (SuperAdmin only)
   */
  @Roles(Role.SUPERADMIN)
  @Patch('admin/:adminId/permissions')
  updateAdminPermissions(
    @Param('adminId') adminId: string,
    @Body('permissions') permissions: Permission[],
    @CurrentUser() currentUser: AuthenticatedUser,
  ) {
    return this.authService.updateAdminPermissions(
      adminId,
      permissions,
      currentUser,
    );
  }

  /**
   * PATCH /api/v1/auth/admin/:adminId/disable
   * Disable admin account (SuperAdmin only) - Soft disable
   */
  @Roles(Role.SUPERADMIN)
  @Patch('admin/:adminId/disable')
  disableAdmin(
    @Param('adminId') adminId: string,
    @CurrentUser() currentUser: AuthenticatedUser,
  ) {
    return this.authService.disableAdmin(adminId, currentUser);
  }

  /**
   * PATCH /api/v1/auth/admin/:adminId/enable
   * Enable admin account (SuperAdmin only)
   */
  @Roles(Role.SUPERADMIN)
  @Patch('admin/:adminId/enable')
  enableAdmin(
    @Param('adminId') adminId: string,
    @CurrentUser() currentUser: AuthenticatedUser,
  ) {
    return this.authService.enableAdmin(adminId, currentUser);
  }

  /**
   * DELETE /api/v1/auth/admin/:adminId
   * Soft delete admin (SuperAdmin only) - Sets isDeleted = true
   */
  @Roles(Role.SUPERADMIN)
  @Delete('admin/:adminId')
  deleteAdmin(
    @Param('adminId') adminId: string,
    @CurrentUser() currentUser: AuthenticatedUser,
  ) {
    return this.authService.deleteAdmin(adminId, currentUser);
  }

  // =========================================
  // CUSTOMER ENDPOINTS
  // =========================================

  /**
   * POST /api/v1/auth/customer/register
   * Customer registration
   */
  @Public()
  @Post('customer/register')
  customerRegister(@Body() dto: CustomerRegisterDto) {
    return this.authService.customerRegister(dto);
  }

  /**
   * POST /api/v1/auth/customer/login
   * Customer login
   */
  @Public()
  @Post('customer/login')
  @HttpCode(HttpStatus.OK)
  customerLogin(@Body() dto: CustomerLoginDto) {
    return this.authService.customerLogin(dto);
  }

  // =========================================
  // COMMON ENDPOINTS
  // =========================================

  /**
   * POST /api/v1/auth/refresh
   * Refresh tokens
   */
  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshTokens(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshTokens(dto.refreshToken);
  }

  /**
   * POST /api/v1/auth/logout
   * Logout current session
   */
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@CurrentUser() user: AuthenticatedUser) {
    return this.authService.logout(user.id, user.userType);
  }

  /**
   * POST /api/v1/auth/logout-all
   * Logout all sessions
   */
  @Post('logout-all')
  @HttpCode(HttpStatus.OK)
  logoutAll(@CurrentUser() user: AuthenticatedUser) {
    return this.authService.logoutAll(user.id, user.userType);
  }

  /**
   * GET /api/v1/auth/me
   * Get current user profile
   */
  @Get('me')
  getProfile(@CurrentUser() user: AuthenticatedUser) {
    return {
      message: 'Profile retrieved successfully',
      data: user,
    };
  }
}
