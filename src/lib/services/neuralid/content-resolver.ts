// Content resolution and personalization system

export interface UserContext {
    userId: string;
    deviceId: string;
    deviceType: 'desktop' | 'mobile' | 'vr' | 'tablet' | 'other';
    preferences: {
        language?: string;
        theme?: string;
        accessibility?: {
            reducedMotion?: boolean;
            highContrast?: boolean;
            textSize?: 'normal' | 'large' | 'xlarge';
        };
    };
    capabilities: {
        screen: {
            width: number;
            height: number;
            dpr: number;
            colorDepth: number;
        };
        connection?: {
            type?: string;
            downlink?: number;
            rtt?: number;
        };
        memory?: {
            deviceMemory?: number;
            jsHeapSizeLimit?: number;
        };
    };
}

export interface ContentResolution {
    id: string;
    slotId: string;
    userId: string;
    resolvedContent: {
        type: 'image' | 'text' | 'component' | 'other';
        metadata: Record<string, any>;
        content: any;
    };
    context: {
        device: string;
        timestamp: string;
        version: number;
    };
}

export class ContentResolver {
    private static instance: ContentResolver;
    private surreal: any;
    private userStateManager: any;
    private imageManager: any;
    private cache = new Map<string, ContentResolution>();
    private userContext: UserContext | null = null;

    private constructor(surreal: any, userStateManager: any, imageManager: any) {
        this.surreal = surreal;
        this.userStateManager = userStateManager;
        this.imageManager = imageManager;
    }

    static getInstance(surreal: any, userStateManager: any, imageManager: any): ContentResolver {
        if (!ContentResolver.instance) {
            ContentResolver.instance = new ContentResolver(surreal, userStateManager, imageManager);
        }
        return ContentResolver.instance;
    }

    private get resolutionTable() {
        return 'NeuralContentResolutions';
    }

    async initializeUserContext(userId: string): Promise<UserContext> {
        const deviceId = this.generateDeviceId();
        const capabilities = await this.detectCapabilities();
        const deviceType = this.detectDeviceType(capabilities);
        const storedPreferences = await this.userStateManager.getUserState(`preferences_${userId}`);

        this.userContext = {
            userId,
            deviceId,
            deviceType,
            preferences: storedPreferences?.data || {},
            capabilities
        };

        return this.userContext;
    }

    private generateDeviceId(): string {
        // Generate a stable device ID based on device characteristics
        const components = [
            navigator.userAgent,
            screen.width,
            screen.height,
            navigator.language,
            new Date().getTimezoneOffset()
        ];
        
        // Create a hash of the components
        return crypto.subtle.digest('SHA-256', new TextEncoder().encode(components.join('_')))
            .then(hash => Array.from(new Uint8Array(hash))
                .map(b => b.toString(16).padStart(2, '0'))
                .join('')
            );
    }

    private async detectCapabilities(): Promise<UserContext['capabilities']> {
        const capabilities: UserContext['capabilities'] = {
            screen: {
                width: window.innerWidth,
                height: window.innerHeight,
                dpr: window.devicePixelRatio,
                colorDepth: screen.colorDepth
            }
        };

        // Check connection capabilities
        if ('connection' in navigator) {
            const conn = (navigator as any).connection;
            capabilities.connection = {
                type: conn.effectiveType,
                downlink: conn.downlink,
                rtt: conn.rtt
            };
        }

        // Check memory capabilities
        if ('deviceMemory' in navigator) {
            capabilities.memory = {
                deviceMemory: (navigator as any).deviceMemory,
                jsHeapSizeLimit: performance?.memory?.jsHeapSizeLimit
            };
        }

        return capabilities;
    }

    private detectDeviceType(capabilities: UserContext['capabilities']): UserContext['deviceType'] {
        const width = capabilities.screen.width;
        
        // VR detection
        if ('xr' in navigator) {
            return 'vr';
        }
        
        // Mobile/Tablet/Desktop detection based on screen width
        if (width <= 768) {
            return 'mobile';
        } else if (width <= 1024) {
            return 'tablet';
        }
        return 'desktop';
    }

    async resolveContent(slotId: string): Promise<ContentResolution> {
        if (!this.userContext) {
            throw new Error('User context not initialized');
        }

        const cacheKey = `${slotId}_${this.userContext.userId}_${this.userContext.deviceId}`;
        const cached = this.cache.get(cacheKey);
        
        // Check if we have a valid cached resolution
        if (cached && this.isResolutionValid(cached)) {
            return cached;
        }

        // Query the database for content resolution
        const query = `
            SELECT * FROM ${this.resolutionTable}
            WHERE 
                slotId = $slotId AND
                userId = $userId
            ORDER BY context.timestamp DESC
            LIMIT 1;
        `;

        const result = await this.surreal.query(query, {
            slotId,
            userId: this.userContext.userId
        });

        const resolution = result[0].result[0];
        
        if (!resolution) {
            throw new Error(`No content found for slot: ${slotId}`);
        }

        // Resolve the actual content based on type
        const resolvedContent = await this.resolveContentByType(resolution);
        
        // Cache the resolution
        this.cache.set(cacheKey, resolvedContent);

        return resolvedContent;
    }

    private isResolutionValid(resolution: ContentResolution): boolean {
        const maxAge = 5 * 60 * 1000; // 5 minutes
        const timestamp = new Date(resolution.context.timestamp).getTime();
        return Date.now() - timestamp < maxAge;
    }

    private async resolveContentByType(resolution: ContentResolution): Promise<ContentResolution> {
        if (!this.userContext) {
            throw new Error('User context not initialized');
        }

        switch (resolution.resolvedContent.type) {
            case 'image':
                const imageMetadata = await this.imageManager.getImageMetadata(resolution.resolvedContent.metadata.imageId);
                const imagePath = this.imageManager.getResolutionPath(
                    resolution.resolvedContent.metadata.imageId,
                    undefined,
                    this.userContext.deviceType
                );
                return {
                    ...resolution,
                    resolvedContent: {
                        ...resolution.resolvedContent,
                        content: {
                            ...resolution.resolvedContent.content,
                            src: imagePath,
                            metadata: imageMetadata
                        }
                    }
                };

            // Add other content type resolutions here
            default:
                return resolution;
        }
    }

    async invalidateCache(slotId?: string): Promise<void> {
        if (slotId) {
            // Remove specific slot from cache
            for (const [key] of this.cache) {
                if (key.startsWith(slotId)) {
                    this.cache.delete(key);
                }
            }
        } else {
            // Clear entire cache
            this.cache.clear();
        }
    }
}
