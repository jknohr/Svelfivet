<script lang="ts">
    import BaseSection from './BaseSection.svelte';
    import { createThemeComposition } from '$lib/components/Theme/ThemeComposition';
    import type { ColorConfig } from '$lib/types/theme';
    import { db } from '$lib/services/surreal/surrealDBService';

    interface Props {
        title?: string;
        description?: string;
        onClose?: () => void;
    }

    let { title = 'AI Settings' }: Props = $props();

    // State management
    let errors = $state(new Map<string, string>());
    let saving = $state(false);
    let saveStatus = $state<'idle' | 'saving' | 'success' | 'error'>('idle');

    // LLM Settings
    let llm = $state({
        provider: 'openai',
        model: 'gpt-4',
        temperature: 0.7,
        maxTokens: 2048,
        apiKey: '',
        enableCaching: true,
        cacheDuration: 3600
    });

    // Voice Settings
    let voice = $state({
        provider: 'speechomatic',
        model: 'neural-v2',
        language: 'en-US',
        enableCache: true,
        cacheDuration: 86400
    });

    // Model Settings
    let model = $state({
        storagePath: '/models',
        maxVersions: 3,
        autoCleanup: true,
        updateInterval: 604800,
        cacheSize: 1024
    });

    // Agent Settings
    let agent = $state({
        maxConcurrent: 10,
        timeout: 300,
        enableLogging: true,
        logRetention: 30,
        memoryLimit: 1024
    });

    // Resource Limits
    let limits = $state({
        maxRequestsPerMinute: 60,
        maxTokensPerDay: 1000000,
        maxAudioMinutesPerDay: 1000
    });

    // Form validation
    function validateSettings() {
        errors.clear();
        
        if (!llm.apiKey && llm.provider !== 'local') {
            errors.set('apiKey', 'API Key is required for cloud providers');
        }
        if (llm.temperature < 0 || llm.temperature > 1) {
            errors.set('temperature', 'Temperature must be between 0 and 1');
        }
        if (llm.maxTokens < 1) {
            errors.set('maxTokens', 'Max tokens must be greater than 0');
        }
        
        return errors.size === 0;
    }

    // Settings object for persistence
    let settings = $derived({
        llm,
        voice,
        model,
        agent,
        limits
    });

    $effect(() => {
        console.log('Settings updated:', settings);
    });

    const theme = createThemeComposition({
        colors: {
            primary: '#6200EA',
            secondary: '#3700B3',
            accent: '#B388FF',
            background: '#FFFFFF',
            surface: '#F5F5F5',
            text: '#212121',
            textLight: '#757575',
            textDark: '#000000',
            error: '#D32F2F',
            success: '#43A047',
            border: '#E0E0E0',
            shadow: 'rgba(0, 0, 0, 0.1)',
            glass: 'rgba(255, 255, 255, 0.8)',
            states: {
                hover: 'rgba(0, 0, 0, 0.04)',
                focus: 'rgba(0, 0, 0, 0.12)',
                selected: 'rgba(0, 0, 0, 0.08)',
                disabled: 'rgba(0, 0, 0, 0.26)'
            }
        } satisfies ColorConfig
    });

    async function saveSettings() {
        if (!validateSettings()) {
            return;
        }

        saving = true;
        saveStatus = 'saving';

        try {
            await db.query('UPDATE ai_settings SET settings = $settings', {
                settings
            });
            saveStatus = 'success';
            setTimeout(() => {
                saveStatus = 'idle';
            }, 3000);
        } catch (error) {
            console.error('Error saving AI settings:', error);
            saveStatus = 'error';
        } finally {
            saving = false;
        }
    }

    $effect(() => {
        const handleKeydown = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && props.onClose) {
                props.onClose();
            }
        };

        window.addEventListener('keydown', handleKeydown);
        return () => window.removeEventListener('keydown', handleKeydown);
    });
</script>

<BaseSection
    title={$props.title ?? 'AI Services Settings'}
    description={$props.description ?? 'Configure AI services and model management preferences'}
>
    <div class="settings-container">
        {#snippet LLMSection()}
            <section class="setting-group" aria-labelledby="llm-title">
                <h3 id="llm-title" tabindex="-1">LLM Configuration</h3>
                <div class="setting-item">
                    <label for="llm-provider" class="setting-label">
                        Provider
                        <span class="required-indicator" aria-hidden="true">*</span>
                        <span class="sr-only">Required</span>
                    </label>
                    <select 
                        id="llm-provider" 
                        bind:value={llm.provider} 
                        name="provider"
                        required
                        aria-invalid={errors.has('provider')}
                        aria-describedby="provider-error"
                    >
                        <option value="openai">OpenAI</option>
                        <option value="anthropic">Anthropic</option>
                        <option value="local">Local Model</option>
                    </select>
                    {#if errors.has('provider')}
                        <div id="provider-error" class="error-message" role="alert">
                            {errors.get('provider')}
                        </div>
                    {/if}
                </div>
                <div class="setting-item">
                    <label for="llm-model" class="setting-label">Model</label>
                    <select 
                        id="llm-model" 
                        bind:value={llm.model} 
                        name="model"
                        aria-invalid={errors.has('model')}
                        aria-describedby="model-error"
                    >
                        <option value="gpt-4">GPT-4</option>
                        <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                        <option value="claude-2">Claude 2</option>
                    </select>
                    {#if errors.has('model')}
                        <div id="model-error" class="error-message" role="alert">
                            {errors.get('model')}
                        </div>
                    {/if}
                </div>
                <div class="setting-item">
                    <label for="llm-temperature" class="setting-label">Temperature</label>
                    <div class="range-container">
                        <input 
                            type="range" 
                            id="llm-temperature"
                            bind:value={llm.temperature}
                            min="0"
                            max="1"
                            step="0.1"
                            name="temperature"
                            aria-invalid={errors.has('temperature')}
                            aria-describedby="temperature-value temperature-error"
                        />
                        <output id="temperature-value" for="llm-temperature">{llm.temperature}</output>
                    </div>
                    {#if errors.has('temperature')}
                        <div id="temperature-error" class="error-message" role="alert">
                            {errors.get('temperature')}
                        </div>
                    {/if}
                </div>
                <div class="setting-item">
                    <label for="llm-api-key" class="setting-label">
                        API Key
                        {#if llm.provider !== 'local'}
                            <span class="required-indicator" aria-hidden="true">*</span>
                            <span class="sr-only">Required</span>
                        {/if}
                    </label>
                    <input 
                        type="password" 
                        id="llm-api-key"
                        bind:value={llm.apiKey}
                        name="apiKey"
                        aria-required={llm.provider !== 'local'}
                        aria-invalid={errors.has('apiKey')}
                        aria-describedby="api-key-error"
                    />
                    {#if errors.has('apiKey')}
                        <div id="api-key-error" class="error-message" role="alert">
                            {errors.get('apiKey')}
                        </div>
                    {/if}
                </div>
            </section>
        {/snippet}

        {#snippet VoiceSection()}
            <section class="setting-group" aria-labelledby="voice-title">
                <h3 id="voice-title" tabindex="-1">Voice Service Configuration</h3>
                <div class="setting-item">
                    <label for="voice-provider" class="setting-label">
                        Provider
                        <span class="required-indicator" aria-hidden="true">*</span>
                        <span class="sr-only">Required</span>
                    </label>
                    <select 
                        id="voice-provider" 
                        bind:value={voice.provider}
                        name="provider"
                        required
                        aria-invalid={errors.has('voiceProvider')}
                        aria-describedby="voice-provider-error"
                    >
                        <option value="speechomatic">Speechomatic</option>
                        <option value="aws">Amazon Polly</option>
                        <option value="google">Google Cloud TTS</option>
                    </select>
                    {#if errors.has('voiceProvider')}
                        <div id="voice-provider-error" class="error-message" role="alert">
                            {errors.get('voiceProvider')}
                        </div>
                    {/if}
                </div>
                <div class="setting-item">
                    <label for="voice-model" class="setting-label">Voice Model</label>
                    <select 
                        id="voice-model" 
                        bind:value={voice.model}
                        name="model"
                        aria-invalid={errors.has('voiceModel')}
                        aria-describedby="voice-model-error"
                    >
                        <option value="neural-v2">Neural V2</option>
                        <option value="standard">Standard</option>
                    </select>
                    {#if errors.has('voiceModel')}
                        <div id="voice-model-error" class="error-message" role="alert">
                            {errors.get('voiceModel')}
                        </div>
                    {/if}
                </div>
                <div class="setting-item">
                    <label for="voice-language" class="setting-label">Language</label>
                    <select 
                        id="voice-language" 
                        bind:value={voice.language}
                        name="language"
                        aria-invalid={errors.has('voiceLanguage')}
                        aria-describedby="voice-language-error"
                    >
                        <option value="en-US">English (US)</option>
                        <option value="en-GB">English (UK)</option>
                        <option value="es-ES">Spanish</option>
                        <option value="fr-FR">French</option>
                        <option value="de-DE">German</option>
                    </select>
                    {#if errors.has('voiceLanguage')}
                        <div id="voice-language-error" class="error-message" role="alert">
                            {errors.get('voiceLanguage')}
                        </div>
                    {/if}
                </div>
            </section>
        {/snippet}

        {#snippet ModelSection()}
            <section class="setting-group" aria-labelledby="model-title">
                <h3 id="model-title" tabindex="-1">Model Management</h3>
                <div class="setting-item">
                    <label for="model-storage" class="setting-label">
                        Storage Path
                        <span class="required-indicator" aria-hidden="true">*</span>
                        <span class="sr-only">Required</span>
                    </label>
                    <input 
                        id="model-storage"
                        type="text" 
                        bind:value={model.storagePath}
                        name="storagePath"
                        required
                        aria-invalid={errors.has('modelStoragePath')}
                        aria-describedby="model-storage-error"
                        placeholder="/path/to/models"
                    />
                    {#if errors.has('modelStoragePath')}
                        <div id="model-storage-error" class="error-message" role="alert">
                            {errors.get('modelStoragePath')}
                        </div>
                    {/if}
                </div>
                <div class="setting-item">
                    <label for="max-versions" class="setting-label">
                        Max Versions
                        <span class="required-indicator" aria-hidden="true">*</span>
                        <span class="sr-only">Required</span>
                    </label>
                    <div class="range-container">
                        <input 
                            id="max-versions"
                            type="range" 
                            bind:value={model.maxVersions}
                            name="maxVersions"
                            min="1"
                            max="10"
                            step="1"
                            required
                            aria-invalid={errors.has('maxModelVersions')}
                            aria-describedby="max-versions-error max-versions-value"
                        />
                        <output id="max-versions-value">{model.maxVersions}</output>
                    </div>
                    {#if errors.has('maxModelVersions')}
                        <div id="max-versions-error" class="error-message" role="alert">
                            {errors.get('maxModelVersions')}
                        </div>
                    {/if}
                </div>
                <div class="setting-item">
                    <label for="cache-size" class="setting-label">Cache Size (MB)</label>
                    <div class="range-container">
                        <input 
                            id="cache-size"
                            type="range" 
                            bind:value={model.cacheSize}
                            name="cacheSize"
                            min="100"
                            max="10000"
                            step="100"
                            aria-invalid={errors.has('modelCacheSize')}
                            aria-describedby="cache-size-error cache-size-value"
                        />
                        <output id="cache-size-value">{model.cacheSize}</output>
                    </div>
                    {#if errors.has('modelCacheSize')}
                        <div id="cache-size-error" class="error-message" role="alert">
                            {errors.get('modelCacheSize')}
                        </div>
                    {/if}
                </div>
            </section>
        {/snippet}

        {#snippet AgentSection()}
            <section class="setting-group" aria-labelledby="agent-title">
                <h3 id="agent-title" tabindex="-1">Agent Configuration</h3>
                <div class="setting-item">
                    <label for="max-agents" class="setting-label">
                        Max Concurrent Agents
                        <span class="required-indicator" aria-hidden="true">*</span>
                        <span class="sr-only">Required</span>
                    </label>
                    <div class="range-container">
                        <input 
                            id="max-agents"
                            type="range" 
                            bind:value={agent.maxConcurrent}
                            name="maxConcurrent"
                            min="1"
                            max="100"
                            step="1"
                            required
                            aria-invalid={errors.has('maxConcurrentAgents')}
                            aria-describedby="max-agents-error max-agents-value"
                        />
                        <output id="max-agents-value">{agent.maxConcurrent}</output>
                    </div>
                    {#if errors.has('maxConcurrentAgents')}
                        <div id="max-agents-error" class="error-message" role="alert">
                            {errors.get('maxConcurrentAgents')}
                        </div>
                    {/if}
                </div>
                <div class="setting-item">
                    <label for="agent-timeout" class="setting-label">Agent Timeout (seconds)</label>
                    <div class="range-container">
                        <input 
                            id="agent-timeout"
                            type="range" 
                            bind:value={agent.timeout}
                            name="timeout"
                            min="30"
                            max="300"
                            step="30"
                            aria-invalid={errors.has('agentTimeout')}
                            aria-describedby="agent-timeout-error agent-timeout-value"
                        />
                        <output id="agent-timeout-value">{agent.timeout}</output>
                    </div>
                    {#if errors.has('agentTimeout')}
                        <div id="agent-timeout-error" class="error-message" role="alert">
                            {errors.get('agentTimeout')}
                        </div>
                    {/if}
                </div>
                <div class="setting-item">
                    <label for="agent-memory" class="setting-label">Memory Limit (MB)</label>
                    <div class="range-container">
                        <input 
                            id="agent-memory"
                            type="range" 
                            bind:value={agent.memoryLimit}
                            name="memoryLimit"
                            min="256"
                            max="4096"
                            step="256"
                            aria-invalid={errors.has('agentMemory')}
                            aria-describedby="agent-memory-error agent-memory-value"
                        />
                        <output id="agent-memory-value">{agent.memoryLimit}</output>
                    </div>
                    {#if errors.has('agentMemory')}
                        <div id="agent-memory-error" class="error-message" role="alert">
                            {errors.get('agentMemory')}
                        </div>
                    {/if}
                </div>
            </section>
        {/snippet}

        {#snippet ResourceSection()}
            <section class="setting-group" aria-labelledby="resource-title">
                <h3 id="resource-title" tabindex="-1">Resource Limits</h3>
                <div class="setting-item">
                    <label for="max-requests" class="setting-label">
                        Max Requests/Minute
                        <span class="required-indicator" aria-hidden="true">*</span>
                        <span class="sr-only">Required</span>
                    </label>
                    <div class="range-container">
                        <input 
                            id="max-requests"
                            type="range" 
                            bind:value={limits.maxRequestsPerMinute}
                            name="maxRequestsPerMinute"
                            min="1"
                            max="1000"
                            step="10"
                            required
                            aria-invalid={errors.has('maxRequestsPerMinute')}
                            aria-describedby="max-requests-error max-requests-value"
                        />
                        <output id="max-requests-value">{limits.maxRequestsPerMinute}</output>
                    </div>
                    {#if errors.has('maxRequestsPerMinute')}
                        <div id="max-requests-error" class="error-message" role="alert">
                            {errors.get('maxRequestsPerMinute')}
                        </div>
                    {/if}
                </div>
                <div class="setting-item">
                    <label for="max-tokens" class="setting-label">Max Tokens/Day</label>
                    <div class="range-container">
                        <input 
                            id="max-tokens"
                            type="range" 
                            bind:value={limits.maxTokensPerDay}
                            name="maxTokensPerDay"
                            min="10000"
                            max="10000000"
                            step="10000"
                            aria-invalid={errors.has('maxTokensPerDay')}
                            aria-describedby="max-tokens-error max-tokens-value"
                        />
                        <output id="max-tokens-value">{limits.maxTokensPerDay}</output>
                    </div>
                    {#if errors.has('maxTokensPerDay')}
                        <div id="max-tokens-error" class="error-message" role="alert">
                            {errors.get('maxTokensPerDay')}
                        </div>
                    {/if}
                </div>
                <div class="setting-item">
                    <label for="max-audio" class="setting-label">Max Audio Minutes/Day</label>
                    <div class="range-container">
                        <input 
                            id="max-audio"
                            type="range" 
                            bind:value={limits.maxAudioMinutesPerDay}
                            name="maxAudioMinutesPerDay"
                            min="10"
                            max="10000"
                            step="10"
                            aria-invalid={errors.has('maxAudioMinutesPerDay')}
                            aria-describedby="max-audio-error max-audio-value"
                        />
                        <output id="max-audio-value">{limits.maxAudioMinutesPerDay}</output>
                    </div>
                    {#if errors.has('maxAudioMinutesPerDay')}
                        <div id="max-audio-error" class="error-message" role="alert">
                            {errors.get('maxAudioMinutesPerDay')}
                        </div>
                    {/if}
                </div>
            </section>
        {/snippet}

        {@render LLMSection()}
        {@render VoiceSection()}
        {@render ModelSection()}
        {@render AgentSection()}
        {@render ResourceSection()}
        
        <div class="actions-container">
            <button 
                onclick={saveSettings} 
                class="save-button" 
                class:saving
                class:success={saveStatus === 'success'}
                class:error={saveStatus === 'error'}
                disabled={saving}
                aria-label="Save AI Settings"
                aria-busy={saving}
            >
                {#if saving}
                    Saving...
                {:else if saveStatus === 'success'}
                    Saved!
                {:else if saveStatus === 'error'}
                    Error Saving
                {:else}
                    Save Settings
                {/if}
            </button>
        </div>
    </div>
</BaseSection>

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

    @media (min-width: 768px) {
        .settings-container {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: var(--spacing-lg);
        }
    }

    .setting-group {
        padding: var(--spacing-md);
        background: var(--glass-tint);
        border-radius: var(--borderRadius-md);
        border: 1px solid var(--border);
        backdrop-filter: blur(var(--glass-blur));
    }

    .setting-item {
        margin-bottom: var(--spacing-md);
    }

    @media (max-width: 480px) {
        .setting-item {
            flex-direction: column;
            align-items: stretch;
            gap: var(--spacing-sm);
        }
    }

    .setting-label {
        display: flex;
        align-items: center;
        gap: var(--spacing-xs);
        font-weight: 500;
        margin-bottom: var(--spacing-xs);
    }

    .required-indicator {
        color: var(--error);
        font-weight: bold;
    }

    .error-message {
        color: var(--error);
        font-size: 0.875rem;
        margin-top: var(--spacing-xs);
    }

    .range-container {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
    }

    input[type="range"] {
        flex: 1;
    }

    output {
        min-width: 3ch;
        text-align: right;
    }

    .actions-container {
        display: flex;
        justify-content: flex-end;
        padding: var(--spacing-md);
        border-top: 1px solid var(--border);
        margin-top: var(--spacing-lg);
        grid-column: 1 / -1;
    }

    .save-button {
        padding: var(--spacing-sm) var(--spacing-md);
        background: var(--primary);
        color: var(--on-primary);
        border: none;
        border-radius: var(--borderRadius-sm);
        font-weight: 500;
        cursor: pointer;
        transition: background 0.2s, transform 0.1s;
        min-width: 120px;
    }

    .save-button:not(:disabled):hover {
        background: var(--primary-dark);
        transform: translateY(-1px);
    }

    .save-button:not(:disabled):active {
        transform: translateY(0);
    }

    .save-button:disabled {
        background: var(--disabled);
        cursor: not-allowed;
        opacity: 0.7;
    }

    .save-button.saving {
        background: var(--primary-light);
    }

    .save-button.success {
        background: var(--success);
    }

    .save-button.error {
        background: var(--error);
    }

    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
    }

    select, input[type="text"], input[type="password"], input[type="number"] {
        width: 100%;
        padding: var(--spacing-sm);
        border: 1px solid var(--border);
        border-radius: var(--borderRadius-sm);
        background: var(--surface);
        color: var(--on-surface);
        transition: border-color 0.2s;
    }

    select:hover, input:hover {
        border-color: var(--border-hover);
    }

    select:focus, input:focus {
        outline: none;
        border-color: var(--primary);
        box-shadow: 0 0 0 2px var(--primary-transparent);
    }

    [aria-invalid="true"] {
        border-color: var(--error);
    }

    [aria-invalid="true"]:focus {
        box-shadow: 0 0 0 2px var(--error-transparent);
    }
</style>