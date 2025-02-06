<!-- ThemePreview.svelte -->
<svelte:options runes={true} />

<script lang="ts">
    import type { ThemeConfig } from '$lib/components/Theme/Theme.types';

    let props = $props<{
        theme: ThemeConfig;
        expanded: boolean;
    }>();

    // Sample text for preview
    const sampleText = "The quick brown fox jumps over the lazy dog";
    const sampleHeading = "Theme Preview";

  

    // Generate CSS variables from theme
    $effect(() => {
        document.documentElement.style.setProperty('--preview-primary', props.theme.colors.primary);
        document.documentElement.style.setProperty('--preview-secondary', props.theme.colors.secondary);
        document.documentElement.style.setProperty('--preview-accent', props.theme.colors.accent);
        document.documentElement.style.setProperty('--preview-background', props.theme.colors.background);
        document.documentElement.style.setProperty('--preview-surface', props.theme.colors.surface);
        document.documentElement.style.setProperty('--preview-text', props.theme.colors.text);
        document.documentElement.style.setProperty('--preview-text-light', props.theme.colors.textLight);
    });
    


</script>

<div class="preview-container" class:expanded={props.expanded}>
    <!-- Typography Preview -->
    <section class="preview-section">
        <h4>Typography</h4>
        <div class="typography-preview">
            <h1 style="font-family: {props.theme.typography.fontFamily.heading}">{sampleHeading}</h1>
            <p style="font-family: {props.theme.typography.fontFamily.base}">{sampleText}</p>
            <code style="font-family: {props.theme.typography.fontFamily.mono}">console.log("Hello World");</code>
        </div>
    </section>

    <!-- Colors Preview -->
    <section class="preview-section">
        <h4>Colors</h4>
        <div class="color-preview">
            <div class="color-sample primary">Primary</div>
            <div class="color-sample secondary">Secondary</div>
            <div class="color-sample accent">Accent</div>
        </div>
    </section>

    <!-- Button States Preview -->
    <section class="preview-section">
        <h4>Button States</h4>
        <div class="button-preview">
            <button class="preview-button default">Default</button>
            <button class="preview-button hover">Hover</button>
            <button class="preview-button active">Active</button>
            <button class="preview-button disabled" disabled>Disabled</button>
        </div>
    </section>

    <!-- Glass Effect Preview -->
    <section class="preview-section">
        <h4>Glass Effect</h4>
        <div class="glass-preview">
            <div class="glass-card">
                <h3>Glass Card</h3>
                <p>With backdrop blur effect</p>
            </div>
        </div>
    </section>

    <!-- Spacing Preview -->
    <section class="preview-section">
        <h4>Spacing</h4>
        <div class="spacing-preview">
            <div class="spacing-block xs">XS</div>
            <div class="spacing-block sm">SM</div>
            <div class="spacing-block md">MD</div>
            <div class="spacing-block lg">LG</div>
        </div>
    </section>
</div>

<style>
    .preview-container {
        height: 100%;
        overflow-y: auto;
        padding: 1rem;
        background: var(--preview-background);
        color: var(--preview-text);
    }

    .preview-section {
        margin-bottom: 2rem;
        padding: 1rem;
        border: 1px solid var(--preview-text-light);
        border-radius: 0.5rem;
    }

    .preview-section h4 {
        margin-bottom: 1rem;
        color: var(--preview-text);
        font-size: 0.875rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    .typography-preview {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .color-preview {
        display: grid;
        gap: 0.5rem;
    }

    .color-sample {
        padding: 1rem;
        border-radius: 0.25rem;
        color: white;
        text-align: center;
    }

    .color-sample.primary {
        background: var(--preview-primary);
    }

    .color-sample.secondary {
        background: var(--preview-secondary);
    }

    .color-sample.accent {
        background: var(--preview-accent);
    }

    .button-preview {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
    }

    .preview-button {
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 0.25rem;
        background: var(--preview-primary);
        color: white;
        cursor: pointer;
    }

    .preview-button.hover {
        opacity: 0.9;
    }

    .preview-button.active {
        opacity: 0.8;
    }

    .preview-button.disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .glass-preview {
        height: 150px;
        background: linear-gradient(45deg, var(--preview-primary), var(--preview-secondary));
        border-radius: 0.5rem;
        padding: 1rem;
        position: relative;
    }

    .glass-card {
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        padding: 1rem;
        border-radius: 0.5rem;
        border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .spacing-preview {
        display: flex;
        align-items: flex-end;
        gap: 1rem;
    }

    .spacing-block {
        background: var(--preview-primary);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 0.25rem;
    }

    .spacing-block.xs { width: 1rem; height: 1rem; }
    .spacing-block.sm { width: 2rem; height: 2rem; }
    .spacing-block.md { width: 3rem; height: 3rem; }
    .spacing-block.lg { width: 4rem; height: 4rem; }
</style>
