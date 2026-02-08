import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { ImageResponseDto } from './dto';
interface UploadOptions {
    folder: string;
    alt?: string;
    createdBy?: string;
}
export declare class UploadService {
    private readonly prisma;
    private readonly config;
    private readonly logger;
    private readonly baseUrl;
    private readonly uploadDir;
    constructor(prisma: PrismaService, config: ConfigService);
    uploadImage(file: Express.Multer.File, options: UploadOptions): Promise<ImageResponseDto>;
    uploadImages(files: Express.Multer.File[], options: UploadOptions): Promise<ImageResponseDto[]>;
    findAll(folder?: string): Promise<{
        message: string;
        data: ImageResponseDto[];
    }>;
    findById(id: string): Promise<{
        message: string;
        data: ImageResponseDto;
    }>;
    softDelete(id: string): Promise<{
        message: string;
    }>;
    softDeleteMany(ids: string[]): Promise<{
        message: string;
    }>;
    restore(id: string): Promise<{
        message: string;
    }>;
    reorder(imageIds: string[]): Promise<{
        message: string;
    }>;
    private validateImage;
    private processAndSaveImage;
    private generateId;
    private formatResponse;
}
export {};
