/**
 * AUTH CONTROLLER - PRODUCTION READY
 *
 * All authentication endpoints with proper validation,
 * IP tracking, and comprehensive Swagger documentation.
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
  Query,
} from '@nestjs/common';
import { Permission, Role } from '@prisma/client';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

import { AuthService } from './auth.service';
import {
  AdminLoginDto,
  CreateAdminDto,
  CustomerRegisterDto,
  CustomerLoginDto,
  RefreshTokenDto,
  UpdatePermissionsDto,
  ChangePasswordDto,
  AdminFilterDto,
} from './dto';
import { Public } from '../common/decorators/public.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { ClientIp } from '../common/decorators/client-ip.decorator';
import type { AuthenticatedUser } from '../common/interfaces';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // =========================================
  // ADMIN ENDPOINTS
  // =========================================

  @ApiOperation({
    summary: 'Admin Login',
    description: 'Authenticate admin user and receive JWT tokens',
  })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiResponse({ status: 429, description: 'Too many requests' })
  @Public()
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 attempts per minute
  @Post('admin/login')
  @HttpCode(HttpStatus.OK)
  adminLogin(@Body() dto: AdminLoginDto, @ClientIp() ipAddress: string) {
    return this.authService.adminLogin(dto, ipAddress);
  }

  @ApiOperation({
    summary: 'Create New Admin',
    description:
      'SuperAdmin can create new admin accounts with specific permissions',
  })
  @ApiResponse({ status: 201, description: 'Admin created successfully' })
  @ApiResponse({
    status: 403,
    description: 'Only SuperAdmin can create admins',
  })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  @ApiBearerAuth('access-token')
  @Roles(Role.SUPERADMIN)
  @Throttle({ default: { limit: 10, ttl: 3600000 } }) // 10 per hour
  @Post('admin/create')
  createAdmin(
    @Body() dto: CreateAdminDto,
    @CurrentUser() currentUser: AuthenticatedUser,
  ) {
    return this.authService.createAdmin(dto, currentUser);
  }

  @ApiOperation({
    summary: 'List All Admins',
    description:
      'Get paginated list of all admin accounts with optional filters',
  })
  @ApiResponse({ status: 200, description: 'Admins retrieved successfully' })
  @ApiResponse({
    status: 403,
    description: 'Only SuperAdmin can view admin list',
  })
  @ApiBearerAuth('access-token')
  @Roles(Role.SUPERADMIN)
  @Get('admin/list')
  getAllAdmins(
    @Query() filterDto: AdminFilterDto,
    @CurrentUser() currentUser: AuthenticatedUser,
  ) {
    return this.authService.getAllAdmins(currentUser, filterDto);
  }

  @ApiOperation({
    summary: 'Update Admin Permissions',
    description:
      'SuperAdmin can modify permissions for any admin (except other SuperAdmins)',
  })
  @ApiParam({ name: 'adminId', description: 'Target admin ID (cuid)' })
  @ApiResponse({ status: 200, description: 'Permissions updated successfully' })
  @ApiResponse({ status: 403, description: 'Cannot modify SuperAdmin' })
  @ApiResponse({ status: 404, description: 'Admin not found' })
  @ApiBearerAuth('access-token')
  @Roles(Role.SUPERADMIN)
  @Patch('admin/:adminId/permissions')
  updateAdminPermissions(
    @Param('adminId') adminId: string,
    @Body() dto: UpdatePermissionsDto,
    @CurrentUser() currentUser: AuthenticatedUser,
  ) {
    return this.authService.updateAdminPermissions(
      adminId,
      dto.permissions,
      currentUser,
    );
  }

  @ApiOperation({
    summary: 'Disable Admin Account',
    description:
      'SuperAdmin can disable admin account (soft disable, revokes all tokens)',
  })
  @ApiParam({ name: 'adminId', description: 'Target admin ID' })
  @ApiResponse({ status: 200, description: 'Admin disabled successfully' })
  @ApiResponse({
    status: 403,
    description: 'Cannot disable your own account or SuperAdmin',
  })
  @ApiBearerAuth('access-token')
  @Roles(Role.SUPERADMIN)
  @Patch('admin/:adminId/disable')
  disableAdmin(
    @Param('adminId') adminId: string,
    @CurrentUser() currentUser: AuthenticatedUser,
  ) {
    return this.authService.disableAdmin(adminId, currentUser);
  }

  @ApiOperation({
    summary: 'Enable Admin Account',
    description: 'SuperAdmin can re-enable previously disabled admin account',
  })
  @ApiParam({ name: 'adminId', description: 'Target admin ID' })
  @ApiResponse({ status: 200, description: 'Admin enabled successfully' })
  @ApiBearerAuth('access-token')
  @Roles(Role.SUPERADMIN)
  @Patch('admin/:adminId/enable')
  enableAdmin(
    @Param('adminId') adminId: string,
    @CurrentUser() currentUser: AuthenticatedUser,
  ) {
    return this.authService.enableAdmin(adminId, currentUser);
  }

  @ApiOperation({
    summary: 'Delete Admin Account',
    description:
      'SuperAdmin can soft delete admin account (sets isDeleted = true, revokes all tokens)',
  })
  @ApiParam({ name: 'adminId', description: 'Target admin ID' })
  @ApiResponse({ status: 200, description: 'Admin deleted successfully' })
  @ApiResponse({
    status: 403,
    description: 'Cannot delete your own account or SuperAdmin',
  })
  @ApiBearerAuth('access-token')
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

  @ApiOperation({
    summary: 'Customer Registration',
    description:
      'Create new customer account. Phone is required, email/password optional for guest checkout.',
  })
  @ApiResponse({ status: 201, description: 'Account created successfully' })
  @ApiResponse({ status: 409, description: 'Phone or email already exists' })
  @ApiResponse({ status: 429, description: 'Too many registration attempts' })
  @Public()
  @Throttle({ default: { limit: 3, ttl: 60000 } }) // 3 per minute
  @Post('customer/register')
  customerRegister(
    @Body() dto: CustomerRegisterDto,
    @ClientIp() ipAddress: string,
  ) {
    return this.authService.customerRegister(dto, ipAddress);
  }

  @ApiOperation({
    summary: 'Customer Login',
    description: 'Login with email or phone + password',
  })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @Public()
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 per minute
  @Post('customer/login')
  @HttpCode(HttpStatus.OK)
  customerLogin(@Body() dto: CustomerLoginDto, @ClientIp() ipAddress: string) {
    return this.authService.customerLogin(dto, ipAddress);
  }

  // =========================================
  // COMMON ENDPOINTS (Admin & Customer)
  // =========================================

  @ApiOperation({
    summary: 'Refresh Access Token',
    description:
      'Get new access token using valid refresh token (token rotation applied)',
  })
  @ApiResponse({ status: 200, description: 'Tokens refreshed successfully' })
  @ApiResponse({ status: 401, description: 'Invalid or expired refresh token' })
  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshTokens(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshTokens(dto.refreshToken);
  }

  @ApiOperation({
    summary: 'Logout Current Session',
    description: 'Revoke current session tokens',
  })
  @ApiResponse({ status: 200, description: 'Logged out successfully' })
  @ApiBearerAuth('access-token')
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@CurrentUser() user: AuthenticatedUser) {
    return this.authService.logout(user.id, user.userType);
  }

  @ApiOperation({
    summary: 'Logout All Sessions',
    description: 'Revoke ALL tokens for current user (all devices)',
  })
  @ApiResponse({ status: 200, description: 'All sessions logged out' })
  @ApiBearerAuth('access-token')
  @Post('logout-all')
  @HttpCode(HttpStatus.OK)
  logoutAll(@CurrentUser() user: AuthenticatedUser) {
    return this.authService.logoutAll(user.id, user.userType);
  }

  @ApiOperation({
    summary: 'Get Current User Profile',
    description: 'Retrieve authenticated user information',
  })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Not authenticated' })
  @ApiBearerAuth('access-token')
  @Get('me')
  getProfile(@CurrentUser() user: AuthenticatedUser) {
    return {
      message: 'Profile retrieved successfully',
      data: user,
    };
  }

  @ApiOperation({
    summary: 'Change Password',
    description: 'Change current user password (revokes all sessions)',
  })
  @ApiResponse({ status: 200, description: 'Password changed successfully' })
  @ApiResponse({ status: 401, description: 'Current password incorrect' })
  @ApiBearerAuth('access-token')
  @Patch('change-password')
  @HttpCode(HttpStatus.OK)
  changePassword(
    @Body() dto: ChangePasswordDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.authService.changePassword(user.id, user.userType, dto);
  }
}
