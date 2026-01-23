/**
 * AUTH CONTROLLER
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
import { AuthenticatedUser } from '../common/interfaces';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('admin/login')
  @HttpCode(HttpStatus.OK)
  adminLogin(@Body() dto: AdminLoginDto) {
    return this.authService.adminLogin(dto);
  }

  @Roles(Role.SUPERADMIN)
  @Post('admin/create')
  createAdmin(
    @Body() dto: CreateAdminDto,
    @CurrentUser() currentUser: AuthenticatedUser,
  ) {
    return this.authService.createAdmin(dto, currentUser);
  }

  @Roles(Role.SUPERADMIN)
  @Get('admin/list')
  getAllAdmins(@CurrentUser() currentUser: AuthenticatedUser) {
    return this.authService.getAllAdmins(currentUser);
  }

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

  @Public()
  @Post('customer/register')
  customerRegister(@Body() dto: CustomerRegisterDto) {
    return this.authService.customerRegister(dto);
  }

  @Public()
  @Post('customer/login')
  @HttpCode(HttpStatus.OK)
  customerLogin(@Body() dto: CustomerLoginDto) {
    return this.authService.customerLogin(dto);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshTokens(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshTokens(dto.refreshToken);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@CurrentUser() user: AuthenticatedUser) {
    return this.authService.logout(user.id, user.userType);
  }

  @Post('logout-all')
  @HttpCode(HttpStatus.OK)
  logoutAll(@CurrentUser() user: AuthenticatedUser) {
    return this.authService.logoutAll(user.id, user.userType);
  }

  @Get('me')
  getProfile(@CurrentUser() user: AuthenticatedUser) {
    return {
      message: 'Profile retrieved successfully',
      data: user,
    };
  }
}
