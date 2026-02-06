/**
 * UPLOAD DTOs
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum } from 'class-validator';

export class UploadImageDto {
  @ApiProperty({
    description: 'Category/folder for the upload',
    example: 'brands',
    enum: [
      'brands',
      'categories',
      'products',
      'products/main',
      'products/gallery',
      'profiles/admins',
      'profiles/customers',
      'tags',
      'temp',
    ],
  })
  @IsString()
  category: string;

  @ApiPropertyOptional({
    description: 'Subfolder within category',
    example: 'logos',
  })
  @IsOptional()
  @IsString()
  subfolder?: string;
}

export class DeleteFileDto {
  @ApiProperty({
    description: 'Full URL of the file to delete',
    example: 'https://yourdomain.com/uploads/brands/brand_uuid_logo.png',
  })
  @IsString()
  url: string;
}
