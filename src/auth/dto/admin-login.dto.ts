import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class AdminLoginDto {
  @ApiProperty({
    example: 'admin@company.com',
    description: 'Admin email address',
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({
    example: 'Password@123',
    description: 'Admin password (min 8 chars)',
  })
  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8)
  password: string;
}
