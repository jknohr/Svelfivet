<script lang="ts">
    import BaseSection from '../BaseSection.svelte';
    import { createThemeComposition } from '$lib/components/Theme/ThemeComposition';

    // Settings state
    let contentSettings = $state({
        // Media settings
        mediaStorageLimit: $state(5120), // 5GB in MB
        allowedMediaTypes: $state(['image/*', 'video/*', 'application/pdf']),
        maxFileSize: $state(100), // MB
        enableMediaCompression: $state(true),
        
        // Page settings
        defaultPageTemplate: $state('blank'),
        enableVersioning: $state(true),
        maxVersions: $state(10),
        autosaveInterval: $state(300), // 5 minutes in seconds
        
        // SEO settings
        enableSEO: $state(true),
        defaultMetaTags: $state({
            'og:type': 'website',
            'twitter:card': 'summary_large_image'
        }),
        
        // Cache settings
        enablePageCache: $state(true),
        pageCacheDuration: $state(3600), // 1 hour in seconds
        enableMediaCache: $state(true),
        mediaCacheDuration: $state(86400), // 24 hours in seconds
        
        // Workflow settings
        enableWorkflow: $state(true),
        requireApproval: $state(true),
        notifyOnChanges: $state(true)
    });

    const theme = createThemeComposition({
        colors: {
            primary: '#2196F3',
            secondary: '#1976D2',
            accent: '#82B1FF'
        }
    });

    async function saveSettings() {
        try {
            // Save settings to database
            await db.query('UPDATE content_settings SET settings = $settings', {
                settings: contentSettings
            });
            // Show success message
            console.log('Settings saved successfully');
        } catch (error) {
            console.error('Error saving settings:', error);
        }
    }

    const mainContent = #snippet {
        <div class="settings-container">
            <section class="setting-group">
                <h3>Media Management</h3>
                <div class="setting-item">
                    <label>Storage Limit (MB)</label>
                    <input 
                        type="number" 
                        bind:value={contentSettings.mediaStorageLimit}
                        min="1024"
                        max="10240"
                    />
                </div>
                <div class="setting-item">
                    <label>Max File Size (MB)</label>
                    <input 
                        type="number" 
                        bind:value={contentSettings.maxFileSize}
                        min="1"
                        max="1000"
                    />
                </div>
                <div class="setting-item">
                    <label>Enable Media Compression</label>
                    <input 
                        type="checkbox" 
                        bind:checked={contentSettings.enableMediaCompression}
                    />
                </div>
            </section>

            <section class="setting-group">
                <h3>Page Management</h3>
                <div class="setting-item">
                    <label>Default Template</label>
                    <select bind:value={contentSettings.defaultPageTemplate}>
                        <option value="blank">Blank</option>
                        <option value="article">Article</option>
                        <option value="landing">Landing Page</option>
                        <option value="documentation">Documentation</option>
                    </select>
                </div>
                <div class="setting-item">
                    <label>Enable Versioning</label>
                    <input 
                        type="checkbox" 
                        bind:checked={contentSettings.enableVersioning}
                    />
                </div>
                <div class="setting-item">
                    <label>Max Versions</label>
                    <input 
                        type="number" 
                        bind:value={contentSettings.maxVersions}
                        min="1"
                        max="100"
                    />
                </div>
                <div class="setting-item">
                    <label>Autosave Interval (seconds)</label>
                    <input 
                        type="number" 
                        bind:value={contentSettings.autosaveInterval}
                        min="60"
                        max="3600"
                    />
                </div>
            </section>

            <section class="setting-group">
                <h3>SEO Settings</h3>
                <div class="setting-item">
                    <label>Enable SEO Features</label>
                    <input 
                        type="checkbox" 
                        bind:checked={contentSettings.enableSEO}
                    />
                </div>
            </section>

            <section class="setting-group">
                <h3>Cache Settings</h3>
                <div class="setting-item">
                    <label>Enable Page Cache</label>
                    <input 
                        type="checkbox" 
                        bind:checked={contentSettings.enablePageCache}
                    />
                </div>
                <div class="setting-item">
                    <label>Page Cache Duration (seconds)</label>
                    <input 
                        type="number" 
                        bind:value={contentSettings.pageCacheDuration}
                        min="300"
                        max="86400"
                    />
                </div>
                <div class="setting-item">
                    <label>Enable Media Cache</label>
                    <input 
                        type="checkbox" 
                        bind:checked={contentSettings.enableMediaCache}
                    />
                </div>
                <div class="setting-item">
                    <label>Media Cache Duration (seconds)</label>
                    <input 
                        type="number" 
                        bind:value={contentSettings.mediaCacheDuration}
                        min="300"
                        max="604800"
                    />
                </div>
            </section>

            <section class="setting-group">
                <h3>Workflow Settings</h3>
                <div class="setting-item">
                    <label>Enable Content Workflow</label>
                    <input 
                        type="checkbox" 
                        bind:checked={contentSettings.enableWorkflow}
                    />
                </div>
                <div class="setting-item">
                    <label>Require Approval</label>
                    <input 
                        type="checkbox" 
                        bind:checked={contentSettings.requireApproval}
                    />
                </div>
                <div class="setting-item">
                    <label>Notify on Changes</label>
                    <input 
                        type="checkbox" 
                        bind:checked={contentSettings.notifyOnChanges}
                    />
                </div>
            </section>

            <div class="actions">
                <button onclick={saveSettings} class="save-button">
                    Save Settings
                </button>
            </div>
        </div>
    };
</script>

<BaseSection
    title="Content Management Settings"
    description="Configure content management system preferences"
    mainContent={mainContent}
/>

<style>
    .settings-container {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-xl);
        padding: var(--spacing-lg);
        background: var(--surface);
        border-radius: var(--borderRadius-lg);
        box-shadow: var(--elevation-low);
    }

    .setting-group {
        background: var(--glass-tint);
        padding: var(--spacing-lg);
        border-radius: var(--borderRadius-md);
        backdrop-filter: blur(var(--glass-blur));
    }

    .setting-group h3 {
        margin: 0 0 var(--spacing-md);
        color: var(--textDark);
        font-size: var(--fontSize-lg);
        font-weight: var(--fontWeight-medium);
    }

    .setting-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: var(--spacing-sm) 0;
        border-bottom: 1px solid var(--border);
    }

    .setting-item:last-child {
        border-bottom: none;
    }

    .setting-item label {
        color: var(--text);
        font-weight: var(--fontWeight-medium);
    }

    input[type="number"],
    input[type="text"],
    select {
        padding: var(--spacing-xs) var(--spacing-sm);
        border: 1px solid var(--border);
        border-radius: var(--borderRadius-sm);
        background: var(--surface);
        color: var(--text);
        width: 200px;
    }

    input[type="checkbox"] {
        width: 20px;
        height: 20px;
        border: 2px solid var(--border);
        border-radius: var(--borderRadius-sm);
        cursor: pointer;
    }

    .actions {
        display: flex;
        justify-content: flex-end;
        margin-top: var(--spacing-xl);
    }

    .save-button {
        padding: var(--spacing-sm) var(--spacing-xl);
        background: var(--primary);
        color: var(--surface);
        border: none;
        border-radius: var(--borderRadius-sm);
        font-weight: var(--fontWeight-medium);
        cursor: pointer;
        transition: all var(--duration-fast) var(--easing-standard);
    }

    .save-button:hover {
        background: var(--states-focus);
    }
</style>
