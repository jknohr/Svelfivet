<script lang="ts">
    import BaseSection from '../BaseSection.svelte';
    import { createThemeComposition } from '$lib/components/Theme/ThemeComposition';

    // Settings state
    let aiSettings = $state({
        // LLM settings
        llmProvider: $state('openai'),
        llmModel: $state('gpt-4'),
        llmTemperature: $state(0.7),
        maxTokens: $state(2048),
        apiKey: $state(''),
        enableCaching: $state(true),
        cacheDuration: $state(3600), // 1 hour in seconds

        // Voice service settings
        voiceProvider: $state('speechomatic'),
        voiceModel: $state('neural-v2'),
        voiceLanguage: $state('en-US'),
        enableVoiceCache: $state(true),
        voiceCacheDuration: $state(86400), // 24 hours

        // Model management
        modelStoragePath: $state('/models'),
        maxModelVersions: $state(3),
        autoCleanupOldVersions: $state(true),
        modelUpdateInterval: $state(604800), // 1 week in seconds

        // Agent settings
        maxConcurrentAgents: $state(10),
        agentTimeout: $state(300), // 5 minutes in seconds
        enableAgentLogging: $state(true),
        agentLogRetention: $state(30), // days

        // Resource limits
        maxRequestsPerMinute: $state(60),
        maxTokensPerDay: $state(1000000),
        maxAudioMinutesPerDay: $state(1000)
    });

    const theme = createThemeComposition({
        colors: {
            primary: '#6200EA',
            secondary: '#3700B3',
            accent: '#B388FF'
        }
    });

    async function saveSettings() {
        try {
            await db.query('UPDATE ai_settings SET settings = $settings', {
                settings: aiSettings
            });
            console.log('AI settings saved successfully');
        } catch (error) {
            console.error('Error saving AI settings:', error);
        }
    }

    const mainContent = #snippet {
        <div class="settings-container">
            <section class="setting-group">
                <h3>LLM Configuration</h3>
                <div class="setting-item">
                    <label>Provider</label>
                    <select bind:value={aiSettings.llmProvider}>
                        <option value="openai">OpenAI</option>
                        <option value="anthropic">Anthropic</option>
                        <option value="local">Local Model</option>
                    </select>
                </div>
                <div class="setting-item">
                    <label>Model</label>
                    <select bind:value={aiSettings.llmModel}>
                        <option value="gpt-4">GPT-4</option>
                        <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                        <option value="claude-2">Claude 2</option>
                    </select>
                </div>
                <div class="setting-item">
                    <label>Temperature</label>
                    <input 
                        type="range" 
                        bind:value={aiSettings.llmTemperature}
                        min="0"
                        max="1"
                        step="0.1"
                    />
                </div>
                <div class="setting-item">
                    <label>Max Tokens</label>
                    <input 
                        type="number" 
                        bind:value={aiSettings.maxTokens}
                        min="1"
                        max="8192"
                    />
                </div>
                <div class="setting-item">
                    <label>API Key</label>
                    <input 
                        type="password" 
                        bind:value={aiSettings.apiKey}
                        placeholder="Enter API key"
                    />
                </div>
            </section>

            <section class="setting-group">
                <h3>Voice Service Configuration</h3>
                <div class="setting-item">
                    <label>Provider</label>
                    <select bind:value={aiSettings.voiceProvider}>
                        <option value="speechomatic">Speechomatic</option>
                        <option value="aws">Amazon Polly</option>
                        <option value="google">Google Cloud TTS</option>
                    </select>
                </div>
                <div class="setting-item">
                    <label>Voice Model</label>
                    <select bind:value={aiSettings.voiceModel}>
                        <option value="neural-v2">Neural V2</option>
                        <option value="standard">Standard</option>
                    </select>
                </div>
                <div class="setting-item">
                    <label>Language</label>
                    <select bind:value={aiSettings.voiceLanguage}>
                        <option value="en-US">English (US)</option>
                        <option value="en-GB">English (UK)</option>
                        <option value="es-ES">Spanish</option>
                        <option value="fr-FR">French</option>
                    </select>
                </div>
            </section>

            <section class="setting-group">
                <h3>Model Management</h3>
                <div class="setting-item">
                    <label>Storage Path</label>
                    <input 
                        type="text" 
                        bind:value={aiSettings.modelStoragePath}
                    />
                </div>
                <div class="setting-item">
                    <label>Max Model Versions</label>
                    <input 
                        type="number" 
                        bind:value={aiSettings.maxModelVersions}
                        min="1"
                        max="10"
                    />
                </div>
                <div class="setting-item">
                    <label>Auto Cleanup Old Versions</label>
                    <input 
                        type="checkbox" 
                        bind:checked={aiSettings.autoCleanupOldVersions}
                    />
                </div>
            </section>

            <section class="setting-group">
                <h3>Agent Configuration</h3>
                <div class="setting-item">
                    <label>Max Concurrent Agents</label>
                    <input 
                        type="number" 
                        bind:value={aiSettings.maxConcurrentAgents}
                        min="1"
                        max="100"
                    />
                </div>
                <div class="setting-item">
                    <label>Agent Timeout (seconds)</label>
                    <input 
                        type="number" 
                        bind:value={aiSettings.agentTimeout}
                        min="60"
                        max="3600"
                    />
                </div>
                <div class="setting-item">
                    <label>Enable Agent Logging</label>
                    <input 
                        type="checkbox" 
                        bind:checked={aiSettings.enableAgentLogging}
                    />
                </div>
            </section>

            <section class="setting-group">
                <h3>Resource Limits</h3>
                <div class="setting-item">
                    <label>Max Requests/Minute</label>
                    <input 
                        type="number" 
                        bind:value={aiSettings.maxRequestsPerMinute}
                        min="1"
                        max="1000"
                    />
                </div>
                <div class="setting-item">
                    <label>Max Tokens/Day</label>
                    <input 
                        type="number" 
                        bind:value={aiSettings.maxTokensPerDay}
                        min="1000"
                        max="10000000"
                    />
                </div>
                <div class="setting-item">
                    <label>Max Audio Minutes/Day</label>
                    <input 
                        type="number" 
                        bind:value={aiSettings.maxAudioMinutesPerDay}
                        min="1"
                        max="10000"
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
    title="AI Services Settings"
    description="Configure AI services and model management preferences"
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
    input[type="password"],
    select {
        padding: var(--spacing-xs) var(--spacing-sm);
        border: 1px solid var(--border);
        border-radius: var(--borderRadius-sm);
        background: var(--surface);
        color: var(--text);
        width: 200px;
    }

    input[type="range"] {
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
