/**
 * CUSTOMER LOGIN DTO
 *
 * Customers can login with either email OR phone.
 */

import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class CustomerLoginDto {
  // Phone is required if email is not provided
  @ValidateIf((o) => !o.email)
  @IsString()
  @IsNotEmpty({ message: 'Phone or email is required' })
  @Matches(/^\+?[1-9]\d{9,14}$/, {
    message: 'Please provide a valid phone number',
  })
  phone?: string;

  // Email is required if phone is not provided
  @ValidateIf((o) => !o.phone)
  @IsEmail({}, { message: 'Please provide a valid email' })
  @IsNotEmpty({ message: 'Phone or email is required' })
  email?: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8)
  password: string;

  @ValidateIf((o) => !o.email && !o.phone)
  @IsNotEmpty({ message: 'Either phone or email must be provided' })
  _requiredField?: never;
}
