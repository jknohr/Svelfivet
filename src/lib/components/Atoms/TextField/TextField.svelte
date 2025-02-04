<svelte:options runes={true} />

<script lang="ts">
  import { onDestroy } from 'svelte';
  import { INPUT_SIZES, INPUT_STATES, INPUT_VARIANTS } from './SearchField.types';
  import GlassPane from '../../Theme/GlassPane.svelte';
  import Typography from '../../Theme/Typography.svelte';

  // Define props using $props()
  let {
    label = '',
    value = $state(''),
    type = 'text',
    placeholder = 'Search...',
    disabled = false,
    size = 'md',
    variant = 'default',
    state = 'default',
    glass = true,
    elevated = false,
    required = false,
    ariaLabel = '',
    debounceTime = 300
  } = $props();

  // Reactive state
  let isFocused = $state(false);
  let isHovered = $state(false);
  let inputElement: HTMLInputElement;
  let debounceTimer: number;
  let isLoading = $state(false);
  let showHint = $state(false);
  let hintTimer: number;

  // Derived state for elevation
  let effectiveElevation = $derived(
    isFocused ? 2 : isHovered ? 1 : 0
  );

  // Debounced search function
  function handleInput() {
    showHint = true;
    resetHintTimer();

    if (debounceTime > 0) {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        performSearch(value);
      }, debounceTime);
    } else {
      performSearch(value);
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

  function handleClear() {
    value = '';
    inputElement.focus();
  }

  async function performSearch(query: string) {
    if (!query) return;
    
    isLoading = true;
    clearTimeout(hintTimer);
    showHint = false;
    
    try {
      const response = await fetch(`https://api.example.com/search?query=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error(`API error: ${response.status}`);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      isLoading = false;
    }
  }

  function resetHintTimer() {
    clearTimeout(hintTimer);
    hintTimer = setTimeout(() => {
      showHint = false;
    }, 20000);
  }

  // Generate a unique ID for the input
  const id = `search-input-${Math.random().toString(36).slice(2, 11)}`;

  // Clean up timers on component destroy
  onDestroy(() => {
    if (debounceTimer) clearTimeout(debounceTimer);
    if (hintTimer) clearTimeout(hintTimer);
  });
</script>

<style>
  .search-field-container {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: var(--ui-space-2);
    z-index: var(--ui-layer-1);
  }
  .search-field-container:hover { z-index: var(--ui-layer-2); }
  .search-field-container:focus-within { z-index: var(--ui-layer-3); }
  .label-wrapper { color: var(--color-text-secondary); }
  input {
    width: 100%;
    height: var(--input-height);
    padding: var(--input-padding);
    padding-right: calc(var(--input-padding) + 48px);
    border: none;
    border-radius: var(--input-radius);
    background: transparent;
    color: var(--color-text);
    font-family: var(--font-family-base);
    font-size: inherit;
    transition: all var(--transition-normal) var(--ease-standard);
  }
  input::placeholder { color: var(--color-text-secondary); opacity: 0.7; }
  input:focus { outline: none; }
  .disabled { opacity: 0.6; cursor: not-allowed; }
  .clear-button, .loading-indicator {
    position: absolute;
    right: var(--ui-grid);
    top: 50%;
    transform: translateY(-50%);
    background: transparent;
    border: none;
    color: var(--color-text-secondary);
    cursor: pointer;
  }
  .search-icon {
    position: absolute;
    left: var(--ui-grid);
    top: 50%;
    transform: translateY(-50%);
    color: var(--color-text-secondary);
  }
  .loading-indicator {
    width: 16px;
    height: 16px;
    border: 2px solid var(--color-text-secondary);
    border-top-color: transparent;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
  }
  .hint-bubble {
    position: absolute;
    top: -30px;
    right: 0;
    background: var(--color-background-secondary);
    color: var(--color-text-secondary);
    padding: 8px 12px;
    border-radius: 12px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    font-size: 0.875rem;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  .hint-bubble.show {
    opacity: 1;
  }
  @keyframes spin {
    from { transform: translateY(-50%) rotate(0deg); }
    to { transform: translateY(-50%) rotate(360deg); }
  }
</style>

<div 
  class="search-field-container" 
  class:disabled 
  onmouseleave={handleMouseLeave}
>
  {#if label}
    <label for={id} class="label-wrapper">
      <Typography size={INPUT_SIZES[size].fontSize}>{label}</Typography>
    </label>
  {/if}

  <GlassPane
    variant={glass ? variant : 'transparent'}
    attentionState={state}
    interactive={!disabled}
    elevated={elevated || effectiveElevation > 0}
    glowOnHover={!disabled}
    class="glass-pane"
  >
    <div style="position: relative; width: 100%;">
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        bind:value
        aria-label={ariaLabel || label}
        aria-invalid={state === 'error'}
        aria-disabled={disabled}
        on:input={handleInput}
        on:focus={handleFocus}
        on:blur={handleBlur}
        on:mouseenter={handleMouseEnter}
        bind:this={inputElement}
      />
      
      {#if value && !disabled}
        <button class="clear-button" on:click={handleClear}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M4.646 4.646a.5.5 0 011-.707L6.207 7.354l3.646-3.647a.5.5 0 11.708.708l-4 4a.5.5 0 01-.708 0l-4-4a.5.5 0 01-.707-1.707L2.343 2.343 4.646 4.646z"/>
          </svg>
        </button>
      {/if}
      
      {#if isLoading}
        <div class="loading-indicator"></div>
      {/if}
      
      <span class="search-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path d="M11.742 10.344a6.5 6.5 0 111.139 1.142l-3.197 3.197a.5.5 0 010-.707l3.197-3.197a.5.5 0 011.063.872l-4.5 4.5a.5.5 0 01-.708 0l-4.5-4.5a.5.5 0 01.872-1.063z"/>
        </svg>
      </span>
      
      {#if showHint}
        <div class="hint-bubble show">Try searching with keywords like "latest news" or "trending topics".</div>
      {/if}
    </div>
  </GlassPane>
</div>