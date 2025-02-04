// Base settings interface
export interface BaseSettings {
    id: string;
    section: string;
    lastUpdated: Date;
    updatedBy: string;
}

// Content Management Settings
export interface ContentSettings extends BaseSettings {
    storage: {
        mediaStorageLimit: number; // in MB
        maxFileSize: number; // in MB
        allowedMediaTypes: string[];
        compressionEnabled: boolean;
    };
    pages: {
        defaultTemplate: string;
        versioningEnabled: boolean;
        maxVersions: number;
        autosaveInterval: number; // in seconds
    };
    seo: {
        enabled: boolean;
        defaultMetaTags: Record<string, string>;
    };
    cache: {
        pageEnabled: boolean;
        pageDuration: number; // in seconds
        mediaEnabled: boolean;
        mediaDuration: number; // in seconds
    };
    workflow: {
        enabled: boolean;
        requireApproval: boolean;
        notifyOnChanges: boolean;
    };
}

// AI Service Settings
export interface AISettings extends BaseSettings {
    llm: {
        provider: string;
        model: string;
        temperature: number;
        maxTokens: number;
        apiKey: string;
        caching: {
            enabled: boolean;
            duration: number; // in seconds
        };
    };
    voice: {
        provider: string;
        model: string;
        language: string;
        cache: {
            enabled: boolean;
            duration: number; // in seconds
        };
    };
    models: {
        storagePath: string;
        maxVersions: number;
        autoCleanup: boolean;
        updateInterval: number; // in seconds
    };
    agents: {
        maxConcurrent: number;
        timeout: number; // in seconds
        logging: {
            enabled: boolean;
            retention: number; // in days
        };
    };
    resources: {
        maxRequestsPerMinute: number;
        maxTokensPerDay: number;
        maxAudioMinutesPerDay: number;
    };
}

// Monitoring Settings
export interface MonitoringSettings extends BaseSettings {
    performance: {
        metrics: string[];
        sampleInterval: number; // in seconds
        retentionPeriod: number; // in days
        alertThresholds: Record<string, number>;
    };
    logging: {
        level: 'debug' | 'info' | 'warn' | 'error';
        retention: number; // in days
        maxSize: number; // in MB
    };
    alerts: {
        enabled: boolean;
        channels: {
            email: boolean;
            slack: boolean;
            webhook: boolean;
        };
        throttling: {
            enabled: boolean;
            period: number; // in seconds
            maxAlerts: number;
        };
    };
    reporting: {
        scheduledReports: {
            enabled: boolean;
            frequency: 'daily' | 'weekly' | 'monthly';
            recipients: string[];
        };
        customReports: {
            maxStorageSize: number; // in MB
            retention: number; // in days
        };
    };
}

// Automation Settings
export interface AutomationSettings extends BaseSettings {
    workflows: {
        maxConcurrent: number;
        timeout: number; // in seconds
        retryPolicy: {
            enabled: boolean;
            maxAttempts: number;
            backoffMultiplier: number;
        };
    };
    rules: {
        maxRulesPerWorkflow: number;
        evaluationTimeout: number; // in milliseconds
        complexityLimit: number;
    };
    triggers: {
        pollInterval: number; // in seconds
        batchSize: number;
        maxQueueSize: number;
    };
    actions: {
        timeout: number; // in seconds
        maxParallel: number;
        rateLimiting: {
            enabled: boolean;
            maxPerMinute: number;
        };
    };
    schedules: {
        timezone: string;
        minInterval: number; // in minutes
        maxFutureSchedules: number;
    };
}

// Integration Settings
export interface IntegrationSettings extends BaseSettings {
    api: {
        rateLimit: number;
        timeout: number; // in seconds
        maxConcurrentRequests: number;
        keyRotationInterval: number; // in days
    };
    webhooks: {
        maxRetries: number;
        timeout: number; // in seconds
        batchSize: number;
        signatureKey: string;
    };
    services: {
        healthCheckInterval: number; // in seconds
        timeout: number; // in seconds
        circuitBreaker: {
            enabled: boolean;
            failureThreshold: number;
            resetTimeout: number; // in seconds
        };
    };
    events: {
        maxQueueSize: number;
        processingTimeout: number; // in seconds
        retentionPeriod: number; // in days
        batchSize: number;
    };
}
