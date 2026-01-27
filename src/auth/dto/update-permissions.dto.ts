import { IsArray, IsEnum } from 'class-validator';
import { Permission } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePermissionsDto {
  @ApiProperty({
    example: [Permission.MANAGE_PRODUCTS, Permission.VIEW_REPORTS],
    enum: Permission,
    isArray: true,
    description: 'Array of permissions to assign to the admin',
  })
  @IsArray()
  @IsEnum(Permission, {
    each: true,
    message: 'Each permission must be a valid Permission enum value',
  })
  permissions: Permission[];
}
