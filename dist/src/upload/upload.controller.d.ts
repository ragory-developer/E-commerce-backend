import { UploadService } from './upload.service';
import type { AuthenticatedUser } from '../common/interfaces';
import { ReorderImagesDto, DeleteImagesDto } from './dto';
export declare class UploadController {
    private readonly uploadService;
    constructor(uploadService: UploadService);
    uploadSingle(file: Express.Multer.File, folder?: string, alt?: string, user?: AuthenticatedUser): Promise<{
        message: string;
        data: import("./dto").ImageResponseDto;
    }>;
    uploadMultiple(files: Express.Multer.File[], folder?: string, alt?: string, user?: AuthenticatedUser): Promise<{
        message: string;
        data: import("./dto").ImageResponseDto[];
    }>;
    findAll(folder?: string): Promise<{
        message: string;
        data: import("./dto").ImageResponseDto[];
    }>;
    findById(id: string): Promise<{
        message: string;
        data: import("./dto").ImageResponseDto;
    }>;
    softDelete(id: string): Promise<{
        message: string;
    }>;
    softDeleteMany(dto: DeleteImagesDto): Promise<{
        message: string;
    }>;
    restore(id: string): Promise<{
        message: string;
    }>;
    reorder(dto: ReorderImagesDto): Promise<{
        message: string;
    }>;
}
