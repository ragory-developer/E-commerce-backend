/**
 * UPLOAD CONTROLLER
 * API endpoints for all file uploads
 */

import {
  Controller,
  Post,
  Delete,
  Body,
  UploadedFile,
  UseInterceptors,
  Get,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { UploadService } from './upload.service';
import { UploadImageDto, DeleteFileDto } from './dto/upload.dto';
import { multerConfig } from './config/multer.config';

@ApiTags('File Upload')
@ApiBearerAuth('access-token')
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  // ========================================
  // IMAGE UPLOAD
  // ========================================

  @ApiOperation({
    summary: 'Upload Image',
    description: 'Upload an image file (jpg, png, webp, gif). Automatically compresses and generates thumbnails.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        category: {
          type: 'string',
          example: 'brands',
          description: 'Category folder (brands, categories, products, etc.)',
        },
        subfolder: {
          type: 'string',
          example: 'logos',
          description: 'Optional subfolder',
        },
      },
      required: ['file', 'category'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Image uploaded successfully',
    schema: {
      example: {
        success: true,
        message: 'Image uploaded successfully',
        data: {
          url: 'https://yourdomain.com/uploads/brands/brands_uuid_logo.webp',
          filename: 'brands_uuid_logo.webp',
          size: 45632,
          mimetype: 'image/webp',
          category: 'brands',
          thumbnails: [
            {
              size: 'small',
              url: 'https://yourdomain.com/uploads/brands/brands_uuid_logo_small.webp',
              width: 150,
              height: 150,
            },
            {
              size: 'medium',
              url: 'https://yourdomain.com/uploads/brands/brands_uuid_logo_medium.webp',
              width: 400,
              height: 400,
            },
          ],
          metadata: {
            width: 1200,
            height: 800,
            format: 'webp',
          },
        },
      },
    },
  })
  @Post('image')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UploadImageDto,
  ) {
    const result = await this.uploadService.uploadImage(
      file,
      dto.category,
      dto.subfolder,
    );

    return {
      message: 'Image uploaded successfully',
      data: result,
    };
  }

  // ========================================
  // VIDEO UPLOAD
  // ========================================

  @ApiOperation({
    summary: 'Upload Video',
    description: 'Upload a video file (mp4, webm, mov, avi). Generates thumbnail automatically.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        category: {
          type: 'string',
          example: 'products',
          description: 'Category folder',
        },
      },
      required: ['file', 'category'],
    },
  })
  @Post('video')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async uploadVideo(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UploadImageDto,
  ) {
    const result = await this.uploadService.uploadVideo(file, dto.category);

    return {
      message: 'Video uploaded successfully',
      data: result,
    };
  }

  // ========================================
  // DOCUMENT UPLOAD
  // ========================================

  @ApiOperation({
    summary: 'Upload Document',
    description: 'Upload a document file (pdf, doc, docx).',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        category: {
          type: 'string',
          example: 'documents',
          description: 'Category folder',
        },
      },
      required: ['file', 'category'],
    },
  })
  @Post('document')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async uploadDocument(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UploadImageDto,
  ) {
    const result = await this.uploadService.uploadDocument(file, dto.category);

    return {
      message: 'Document uploaded successfully',
      data: result,
    };
  }

  // ========================================
  // EXCEL UPLOAD
  // ========================================

  @ApiOperation({
    summary: 'Upload Excel/CSV',
    description: 'Upload an Excel or CSV file for data import.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        category: {
          type: 'string',
          example: 'excel',
          description: 'Category folder',
        },
      },
      required: ['file', 'category'],
    },
  })
  @Post('excel')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async uploadExcel(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UploadImageDto,
  ) {
    const result = await this.uploadService.uploadExcel(file, dto.category);

    return {
      message: 'Excel file uploaded successfully',
      data: result,
    };
  }

  // ========================================
  // DELETE FILE
  // ========================================

  @ApiOperation({
    summary: 'Delete File',
    description: 'Delete a file and its thumbnails by URL.',
  })
  @Delete('image')
  async deleteFile(@Body() dto: DeleteFileDto) {
    const result = await this.uploadService.deleteFile(dto.url);

    return {
      message: 'File deleted successfully',
      data: result,
    };
  }

  // ========================================
  // GET FILE INFO
  // ========================================

  @ApiOperation({
    summary: 'Get File Info',
    description: 'Get information about an uploaded file.',
  })
  @Get('info')
  async getFileInfo(@Query('url') url: string) {
    const result = await this.uploadService.getFileInfo(url);

    return {
      message: 'File info retrieved successfully',
      data: result,
    };
  }
}
