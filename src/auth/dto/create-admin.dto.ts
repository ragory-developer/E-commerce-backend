import {
  IsArray,
  isEmail,
  IsEmail,
  IsEnum,
  isNotEmpty,
  IsNotEmpty,
  IsOptional,
  isString,
  IsString,
  Matches,
  MinLength,
  IsNotEmail,
} from 'class-validator';
import { Permission, Role } from '@prisma/client';

export class CreateAdminDto {
  @IsString()
  @IsNotEmpty({ message: 'First name is required' })
  firstName: string;

  @IsString()
  @IsNotEmpty({ message: 'Last name is required' })
  lastName: string;

  @IsEmail({}, { message: 'please provide a valid email' })
  @IsNotEmail({ message: 'Email is required' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'password is required' })
  @MinLength(8, { message: 'Password must be at lest 8 characters' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message:
      'Password must contain uppercase, Lowercase, number and special character',
  })
  password: string;
  @IsString()
  @IsOptional()
  phone?: string;

  @IsEnum(Role, { message: 'Role must be either ADMIN or SUPER_ADMIN' })
  role: Role;

  @IsArray()
  @IsEnum(Permission, { each: true, message: 'Invalid permission provided' })
  @IsOptional()
  permissions?: Permission[] = [];
}
