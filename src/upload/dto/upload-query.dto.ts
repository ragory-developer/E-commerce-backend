import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsIn, MaxLength } from 'class-validator';
import { VALID_FOLDERS, ImageFolder } from '../upload.constants';

export class UploadQueryDto {
  @ApiPropertyOptional({
    description: 'Folder to store image',
    enum: VALID_FOLDERS,
    example: 'product',
  })
  @IsOptional()
  @IsIn(VALID_FOLDERS)
  folder?: ImageFolder;

  @ApiPropertyOptional({
    description: 'Alt text for SEO',
    example: 'Red Nike Running Shoes',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  alt?: string;
}
