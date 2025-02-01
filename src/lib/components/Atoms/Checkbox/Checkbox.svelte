<!--
@component Checkbox
A modern checkbox component with glass effect styling and theme integration.
Features:
- Glass effect styling with hover and focus states
- Accessible keyboard navigation
- Theme system integration
- Custom styling through CSS variables
- Animated state transitions
-->
<svelte:options runes={true} />

<script lang="ts">
    import { getContext } from 'svelte';
    import type { UnifiedThemeContext } from '$lib/components/Theme/Theme.types';
    import type { CheckboxProps } from './Checkbox.types';
    import GlassPane from '$lib/components/Theme/GlassPane.svelte';
    import Typography from '$lib/components/Theme/Typography.svelte';
    import { createElementRunes } from '$lib/components/Theme/ThemeElements';
    import type { ElementType } from '$lib/components/Theme/ThemeElements';

    // Props with bindable checked
    const {
        checked = $bindable(false),
        label,
        disabled = false,
        required = false,
        name,
        value,
        variant = 'light',
        state: glassState = 'default',
        glowOnHover = true,
        ariaLabel,
        onCheckedChange
    } = $props();

    // Theme context
    const themeContext = getContext<UnifiedThemeContext>('theme');

    // State
    let isChecked = $state(checked);
    let isFocused = $state(false);
    let isHovered = $state(false);

    // Create element runes
    const element = createElementRunes('toggle' as ElementType);
    const elementState = element.state.create();

    // Update element state
    $effect(() => {
        elementState.disabled = disabled;
        elementState.active = isChecked;
    });

    // Handle state changes
    $effect(() => {
        if (isChecked !== checked) {
            isChecked = checked;
        }
    });

    // Event Handlers
    function handleChange(event: Event) {
        if (disabled) return;
        
        const target = event.target as HTMLInputElement;
        isChecked = target.checked;
        onCheckedChange?.(isChecked);
    }

    function handleKeyDown(event: KeyboardEvent) {
        if (disabled) return;
        
        if (event.key === ' ' || event.key === 'Enter') {
            event.preventDefault();
            isChecked = !isChecked;
            onCheckedChange?.(isChecked);
        }
    }

    function handleFocus() {
        isFocused = true;
    }

    function handleBlur() {
        isFocused = false;
    }

    function handleMouseEnter() {
        isHovered = true;
    }

    function handleMouseLeave() {
        isHovered = false;
    }

    // Generate unique ID for input-label association
    const id = `checkbox-${Math.random().toString(36).slice(2, 11)}`;

    // Compute current glass state
    const currentGlassState = $derived(() => {
        if (disabled) return 'default';
        if (glassState !== 'default') return glassState;
        if (isChecked) return 'success';
        return 'default';
    });
</script>

{#snippet checkIcon()}
    <Typography family="icon" size="sm">
        check
    </Typography>
{/snippet}

{#snippet checkboxLabel(labelText: string)}
    <span class="label-text">
        <Typography size="base">
            {labelText}
        </Typography>
    </span>
{/snippet}

<div
    class="checkbox-container"
    class:disabled
    class:checked={isChecked}
    class:focused={isFocused}
    class:hovered={isHovered}
    onmouseenter={handleMouseEnter}
    onmouseleave={handleMouseLeave}
>
    <GlassPane
        variant={variant}
        state={currentGlassState}
        interactive={!disabled}
        glowOnHover={glowOnHover && !disabled}
        componentType="checkbox"
    >
        <label
            for={id}
            class="checkbox-label"
            class:disabled
        >
            <input
                {id}
                {name}
                {value}
                {required}
                {disabled}
                type="checkbox"
                checked={isChecked}
                aria-label={ariaLabel}
                aria-checked={isChecked}
                aria-disabled={disabled}
                onchange={handleChange}
                onkeydown={handleKeyDown}
                onfocus={handleFocus}
                onblur={handleBlur}
            />
            
            <div class="checkbox-box">
                {#if isChecked}
                    {@render checkIcon()}
                {/if}
            </div>

            {#if label}
                {@render checkboxLabel(label)}
            {/if}
        </label>
    </GlassPane>
</div>

<style>
    .checkbox-container {
        display: inline-flex;
        position: relative;
        user-select: none;
    }

    .checkbox-label {
        display: flex;
        align-items: center;
        gap: var(--space-2);
        padding: var(--space-2);
        cursor: pointer;
        transition: all var(--transition-normal) var(--ease-standard);
    }

    .checkbox-label.disabled {
        cursor: not-allowed;
        opacity: 0.5;
    }

    .checkbox-box {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 1.25rem;
        height: 1.25rem;
        border: 1px solid var(--color-border);
        border-radius: var(--radius-sm);
        background: var(--color-surface);
        color: var(--color-text);
        transition: all var(--transition-normal) var(--ease-standard);
    }

    input {
        position: absolute;
        opacity: 0;
        width: 0;
        height: 0;
    }

    input:focus-visible + .checkbox-box {
        outline: 2px solid var(--color-focus);
        outline-offset: 2px;
    }

    .checked .checkbox-box {
        background: var(--color-primary);
        border-color: var(--color-primary);
        color: var(--color-surface);
    }

    .label-text {
        color: var(--color-text);
    }

    /* Glass effect styles */
    :global(.checkbox-container .glass-pane) {
        backdrop-filter: var(--glass-blur);
        background: var(--glass-background);
        border-color: var(--glass-border);
    }

    /* Spatial styles */
    @media (--ar) {
        .checkbox-container {
            transform-style: preserve-3d;
            transform: translateZ(var(--depth-floating));
        }
    }

    @media (--vr) {
        .checkbox-container {
            transform-style: preserve-3d;
            transform: translateZ(var(--depth-ui));
        }
    }
</style>