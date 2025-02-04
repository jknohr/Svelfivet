-- Create settings table
CREATE TABLE settings (
    id TEXT PRIMARY KEY,
    section TEXT NOT NULL,
    data OBJECT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_by TEXT NOT NULL,
    version INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true
);

-- Create index for faster section lookups
DEFINE INDEX settings_section_idx ON settings COLUMNS section;

-- Create index for active settings
DEFINE INDEX settings_active_idx ON settings COLUMNS is_active;

-- Create function to update timestamp
DEFINE FUNCTION fn_update_timestamp() {
    RETURN TIME::now();
}

-- Create trigger to update timestamp
DEFINE EVENT settings_updated ON TABLE settings WHEN $event = "UPDATE" THEN {
    UPDATE settings SET updated_at = fn_update_timestamp() WHERE id = $after.id;
}

-- Insert default settings for each section
CREATE content_settings SET 
    id = 'content_settings',
    section = 'content',
    data = {
        storage: {
            mediaStorageLimit: 5120,
            maxFileSize: 100,
            allowedMediaTypes: ['image/*', 'video/*', 'application/pdf'],
            compressionEnabled: true
        },
        pages: {
            defaultTemplate: 'blank',
            versioningEnabled: true,
            maxVersions: 10,
            autosaveInterval: 300
        },
        seo: {
            enabled: true,
            defaultMetaTags: {
                'og:type': 'website',
                'twitter:card': 'summary_large_image'
            }
        },
        cache: {
            pageEnabled: true,
            pageDuration: 3600,
            mediaEnabled: true,
            mediaDuration: 86400
        },
        workflow: {
            enabled: true,
            requireApproval: true,
            notifyOnChanges: true
        }
    },
    updated_by = 'system';

CREATE ai_settings SET 
    id = 'ai_settings',
    section = 'ai',
    data = {
        llm: {
            provider: 'openai',
            model: 'gpt-4',
            temperature: 0.7,
            maxTokens: 2048,
            apiKey: '',
            caching: {
                enabled: true,
                duration: 3600
            }
        },
        voice: {
            provider: 'speechomatic',
            model: 'neural-v2',
            language: 'en-US',
            cache: {
                enabled: true,
                duration: 86400
            }
        },
        models: {
            storagePath: '/models',
            maxVersions: 3,
            autoCleanup: true,
            updateInterval: 604800
        },
        agents: {
            maxConcurrent: 10,
            timeout: 300,
            logging: {
                enabled: true,
                retention: 30
            }
        },
        resources: {
            maxRequestsPerMinute: 60,
            maxTokensPerDay: 1000000,
            maxAudioMinutesPerDay: 1000
        }
    },
    updated_by = 'system';

-- Add other default settings for monitoring, automation, and integration
-- ... (similar structure as above)
