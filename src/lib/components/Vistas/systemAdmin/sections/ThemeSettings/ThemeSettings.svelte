<!-- ThemeSettings.svelte -->
<svelte:options runes={true} />

<script lang="ts">
    import { defaultTheme } from '$lib/components/Theme/defaulttheme';
    import type { ThemeConfig } from '$lib/components/Theme/Theme.types';
    import BaseSection from '../BaseSection.svelte';
    import ThemePreview from './ThemePreview.svelte';
    import ColorWheel from './ColorWheel.svelte';

    let currentTheme = $state<ThemeConfig>({ ...defaultTheme });
    let activeSection = $state<string>('colors');
    let selectedColor = $state<{ path: string[]; value: string } | null>(null);
    let showColorWheel = $state(false);

    // Function to update theme values
    function updateThemeValue(path: string[], value: any) {
        let target = currentTheme;
        for (let i = 0; i < path.length - 1; i++) {
            target = target[path[i]];
        }
        target[path[path.length - 1]] = value;
    }

    function openColorWheel(path: string[], value: string) {
        selectedColor = { path, value };
        showColorWheel = true;
    }

    function handleColorChange(color: string) {
        if (selectedColor) {
            updateThemeValue(selectedColor.path, color);
        }
    }
</script>

<BaseSection>
    <!-- Main Content Area -->
    <div slot="main" class="theme-config">
        <nav class="section-nav">
            <button 
                class:active={activeSection === 'colors'}
                onclick={() => activeSection = 'colors'}
            >
                Colors
            </button>
            <button 
                class:active={activeSection === 'typography'}
                onclick={() => activeSection = 'typography'}
            >
                Typography
            </button>
            <button 
                class:active={activeSection === 'effects'}
                onclick={() => activeSection = 'effects'}
            >
                Effects
            </button>
            <button 
                class:active={activeSection === 'spacing'}
                onclick={() => activeSection = 'spacing'}
            >
                Spacing
            </button>
        </nav>

        <div class="config-section">
            {#if activeSection === 'colors'}
                <div class="color-settings">
                    <h3>Base Colors</h3>
                    <div class="color-grid">
                        <div class="color-item" onclick={() => openColorWheel(['colors', 'primary'], currentTheme.colors.primary)}>
                            <div class="color-preview" style="background-color: {currentTheme.colors.primary}"></div>
                            <div class="color-info">
                                <span>Primary</span>
                                <code>{currentTheme.colors.primary}</code>
                            </div>
                        </div>
                        <div class="color-item" onclick={() => openColorWheel(['colors', 'secondary'], currentTheme.colors.secondary)}>
                            <div class="color-preview" style="background-color: {currentTheme.colors.secondary}"></div>
                            <div class="color-info">
                                <span>Secondary</span>
                                <code>{currentTheme.colors.secondary}</code>
                            </div>
                        </div>
                        <div class="color-item" onclick={() => openColorWheel(['colors', 'accent'], currentTheme.colors.accent)}>
                            <div class="color-preview" style="background-color: {currentTheme.colors.accent}"></div>
                            <div class="color-info">
                                <span>Accent</span>
                                <code>{currentTheme.colors.accent}</code>
                            </div>
                        </div>
                    </div>

                    <h3>Text Colors</h3>
                    <div class="color-grid">
                        <div class="color-item" onclick={() => openColorWheel(['colors', 'text'], currentTheme.colors.text)}>
                            <div class="color-preview" style="background-color: {currentTheme.colors.text}"></div>
                            <div class="color-info">
                                <span>Text</span>
                                <code>{currentTheme.colors.text}</code>
                            </div>
                        </div>
                        <div class="color-item" onclick={() => openColorWheel(['colors', 'textLight'], currentTheme.colors.textLight)}>
                            <div class="color-preview" style="background-color: {currentTheme.colors.textLight}"></div>
                            <div class="color-info">
                                <span>Text Light</span>
                                <code>{currentTheme.colors.textLight}</code>
                            </div>
                        </div>
                    </div>

                    <h3>Glass Effects</h3>
                    <div class="color-grid">
                        <div class="color-item" onclick={() => openColorWheel(['colors', 'glass', 'tint'], currentTheme.colors.glass.tint)}>
                            <div class="color-preview glass" style="background-color: {currentTheme.colors.glass.tint}"></div>
                            <div class="color-info">
                                <span>Glass Tint</span>
                                <code>{currentTheme.colors.glass.tint}</code>
                            </div>
                        </div>
                        <div class="color-item" onclick={() => openColorWheel(['colors', 'glass', 'border'], currentTheme.colors.glass.border)}>
                            <div class="color-preview glass" style="background-color: {currentTheme.colors.glass.border}"></div>
                            <div class="color-info">
                                <span>Glass Border</span>
                                <code>{currentTheme.colors.glass.border}</code>
                            </div>
                        </div>
                    </div>
                </div>
            {/if}

            {#if activeSection === 'typography'}
                <div class="typography-settings">
                    <h3>Font Families</h3>
                    <div class="input-group">
                        <label>Base Font</label>
                        <input 
                            type="text" 
                            value={currentTheme.typography.fontFamily.base}
                            onchange={(e) => updateThemeValue(['typography', 'fontFamily', 'base'], e.target.value)}
                        />
                    </div>
                    <div class="input-group">
                        <label>Heading Font</label>
                        <input 
                            type="text" 
                            value={currentTheme.typography.fontFamily.heading}
                            onchange={(e) => updateThemeValue(['typography', 'fontFamily', 'heading'], e.target.value)}
                        />
                    </div>
                </div>
            {/if}
        </div>
    </div>

    <!-- Left Preview Panel -->
    <div slot="left" class="preview-panel">
        <ThemePreview theme={currentTheme} />
    </div>

    <!-- Right Color Wheel Panel -->
    {#if showColorWheel}
        <div slot="right" class="color-wheel-panel">
            <div class="panel-header">
                <h3>Color Editor</h3>
                <button onclick={() => showColorWheel = false}>×</button>
            </div>
            <ColorWheel 
                color={selectedColor?.value ?? '#000000'} 
                onchange={handleColorChange}
            />
        </div>
    {/if}
</BaseSection>

<style>
    .theme-config {
        flex: 1;
        padding: 2rem;
        overflow-y: auto;
    }

    .preview-panel {
        width: 300px;
        border-right: 1px solid var(--border-color);
    }

    .color-wheel-panel {
        width: 300px;
        background: var(--surface-color);
        border-left: 1px solid var(--border-color);
        padding: 1rem;
    }

    .panel-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
    }

    .panel-header button {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0.5rem;
    }

    .section-nav {
        display: flex;
        gap: 1rem;
        margin-bottom: 2rem;
        border-bottom: 1px solid var(--border-color);
        padding-bottom: 1rem;
    }

    .section-nav button {
        background: none;
        border: none;
        padding: 0.5rem 1rem;
        cursor: pointer;
        border-radius: 0.25rem;
    }

    .section-nav button:hover {
        background: var(--surface-hover);
    }

    .section-nav button.active {
        background: var(--primary-color);
        color: white;
    }

    .color-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 1rem;
        margin-bottom: 2rem;
    }

    .color-item {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 0.5rem;
        border: 1px solid var(--border-color);
        border-radius: 0.25rem;
        cursor: pointer;
    }

    .color-item:hover {
        background: var(--surface-hover);
    }

    .color-preview {
        width: 40px;
        height: 40px;
        border-radius: 0.25rem;
        border: 1px solid var(--border-color);
    }

    .color-preview.glass {
        background-image: linear-gradient(45deg, #eee 25%, transparent 25%),
                          linear-gradient(-45deg, #eee 25%, transparent 25%),
                          linear-gradient(45deg, transparent 75%, #eee 75%),
                          linear-gradient(-45deg, transparent 75%, #eee 75%);
        background-size: 10px 10px;
        background-position: 0 0, 0 5px, 5px -5px, -5px 0px;
    }

    .color-info {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }

    .color-info code {
        font-size: 0.875rem;
        color: var(--text-light);
    }

    .input-group {
        margin-bottom: 1rem;
    }

    .input-group label {
        display: block;
        margin-bottom: 0.5rem;
    }

    .input-group input {
        width: 100%;
        padding: 0.5rem;
        border: 1px solid var(--border-color);
        border-radius: 0.25rem;
    }
</style>
