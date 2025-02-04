// Image metadata and resolution management for Neural ID system

export interface ImageResolution {
    width: number;
    height: number;
    quality: number;
    format: 'webp' | 'jpg' | 'png' | 'avif';
    fileSize: number;
    filePath: string;
}

export interface ImageMetadata {
    id: string;
    slotId: string;
    originalFilename: string;
    mimeType: string;
    createdAt: string;
    updatedAt: string;
    resolutions: Record<string, ImageResolution>; // key is resolution identifier e.g., "thumbnail", "medium", "large", "original"
    metadata: {
        width: number;
        height: number;
        aspectRatio: number;
        colorSpace?: string;
        hasAlpha?: boolean;
        tags?: string[];
        description?: string;
        alt?: string;
        deviceOptimized?: {
            mobile?: string;  // resolution key
            desktop?: string; // resolution key
            vr?: string;     // resolution key
        };
    };
}

export class ImageMetadataManager {
    private static instance: ImageMetadataManager;
    private surreal: any;
    private baseStoragePath: string;
    
    private constructor(surreal: any, baseStoragePath: string) {
        this.surreal = surreal;
        this.baseStoragePath = baseStoragePath;
    }

    static getInstance(surreal: any, baseStoragePath: string): ImageMetadataManager {
        if (!ImageMetadataManager.instance) {
            ImageMetadataManager.instance = new ImageMetadataManager(surreal, baseStoragePath);
        }
        return ImageMetadataManager.instance;
    }

    private get imagesTable() {
        return 'NeuralImages';
    }

    private generateStoragePath(id: string, resolution: string, format: string): string {
        // Creates a path like: baseStoragePath/ab/cd/abcdef123456/medium.webp
        const prefix1 = id.substring(0, 2);
        const prefix2 = id.substring(2, 4);
        return `${this.baseStoragePath}/${prefix1}/${prefix2}/${id}/${resolution}.${format}`;
    }

    async createImageMetadata(
        slotId: string,
        originalFilename: string,
        mimeType: string,
        originalMetadata: {
            width: number;
            height: number;
            fileSize: number;
            hasAlpha?: boolean;
            colorSpace?: string;
        }
    ): Promise<ImageMetadata> {
        const id = crypto.randomUUID();
        const timestamp = new Date().toISOString();
        const aspectRatio = originalMetadata.width / originalMetadata.height;

        const query = `
            CREATE ${this.imagesTable}:${id}
            SET
                slotId = $slotId,
                originalFilename = $originalFilename,
                mimeType = $mimeType,
                createdAt = $timestamp,
                updatedAt = $timestamp,
                resolutions = $resolutions,
                metadata = $metadata;
        `;

        // Start with original resolution
        const originalResolution: ImageResolution = {
            width: originalMetadata.width,
            height: originalMetadata.height,
            quality: 100,
            format: 'webp',
            fileSize: originalMetadata.fileSize,
            filePath: this.generateStoragePath(id, 'original', 'webp')
        };

        // Create standard resolutions
        const resolutions: Record<string, ImageResolution> = {
            original: originalResolution,
            thumbnail: {
                width: Math.round(256 * aspectRatio),
                height: 256,
                quality: 80,
                format: 'webp',
                fileSize: 0, // Will be updated after processing
                filePath: this.generateStoragePath(id, 'thumbnail', 'webp')
            },
            medium: {
                width: Math.round(512 * aspectRatio),
                height: 512,
                quality: 85,
                format: 'webp',
                fileSize: 0,
                filePath: this.generateStoragePath(id, 'medium', 'webp')
            },
            large: {
                width: Math.round(1024 * aspectRatio),
                height: 1024,
                quality: 90,
                format: 'webp',
                fileSize: 0,
                filePath: this.generateStoragePath(id, 'large', 'webp')
            }
        };

        // Determine optimal resolutions for different devices
        const deviceOptimized = {
            mobile: originalMetadata.width <= 512 ? 'original' : 'medium',
            desktop: originalMetadata.width <= 1024 ? 'original' : 'large',
            vr: 'original' // VR might need highest quality
        };

        const metadata = {
            width: originalMetadata.width,
            height: originalMetadata.height,
            aspectRatio,
            colorSpace: originalMetadata.colorSpace,
            hasAlpha: originalMetadata.hasAlpha,
            deviceOptimized
        };

        await this.surreal.query(query, {
            slotId,
            originalFilename,
            mimeType,
            timestamp,
            resolutions,
            metadata
        });

        return {
            id,
            slotId,
            originalFilename,
            mimeType,
            createdAt: timestamp,
            updatedAt: timestamp,
            resolutions,
            metadata
        };
    }

    async updateImageResolution(
        id: string,
        resolutionKey: string,
        resolution: Partial<ImageResolution>
    ): Promise<void> {
        const timestamp = new Date().toISOString();
        
        const query = `
            UPDATE ${this.imagesTable}:${id}
            MERGE resolutions[$resolutionKey] = $resolution
            SET updatedAt = $timestamp;
        `;

        await this.surreal.query(query, {
            resolutionKey,
            resolution,
            timestamp
        });
    }

    async getImageMetadata(id: string): Promise<ImageMetadata | null> {
        const query = `SELECT * FROM ${this.imagesTable}:${id};`;
        const result = await this.surreal.query(query);
        return result[0].result[0] || null;
    }

    async getImagesBySlotId(slotId: string): Promise<ImageMetadata[]> {
        const query = `
            SELECT * 
            FROM ${this.imagesTable}
            WHERE slotId = $slotId
            ORDER BY createdAt DESC;
        `;
        
        const result = await this.surreal.query(query, { slotId });
        return result[0].result;
    }

    async updateImageMetadata(
        id: string,
        metadata: Partial<ImageMetadata['metadata']>
    ): Promise<void> {
        const timestamp = new Date().toISOString();
        
        const query = `
            UPDATE ${this.imagesTable}:${id}
            MERGE metadata = $metadata
            SET updatedAt = $timestamp;
        `;

        await this.surreal.query(query, {
            metadata,
            timestamp
        });
    }

    getResolutionPath(id: string, preferredResolution?: string, deviceType?: 'mobile' | 'desktop' | 'vr'): string {
        const metadata = this.getImageMetadata(id);
        if (!metadata) throw new Error(`Image metadata not found for id: ${id}`);

        // If device type is specified, use the optimized resolution
        if (deviceType && metadata.metadata.deviceOptimized?.[deviceType]) {
            preferredResolution = metadata.metadata.deviceOptimized[deviceType];
        }

        // If no preferred resolution or device type, use original
        if (!preferredResolution) {
            preferredResolution = 'original';
        }

        // Get the resolution data
        const resolution = metadata.resolutions[preferredResolution];
        if (!resolution) {
            throw new Error(`Resolution ${preferredResolution} not found for image ${id}`);
        }

        return resolution.filePath;
    }

    async deleteImage(id: string): Promise<void> {
        // Note: This only deletes the metadata. The actual file deletion should be handled separately
        const query = `DELETE ${this.imagesTable}:${id};`;
        await this.surreal.query(query);
    }
}
