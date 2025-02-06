<script lang="ts">
    import { onDestroy } from 'svelte';
    
    // Types for component props
    interface Props {
        items: string[];
        value?: string;
        placeholder?: string;
        maxSuggestions?: number;
        minChars?: number;
        class?: string;
        disabled?: boolean;
        loading?: boolean;  // New prop for loading state
        filterFn?: (item: string, input: string) => boolean;  // New prop for custom filtering
        highlightMatches?: boolean;  // New prop to control text highlighting
    }

    // Group interface for categorized suggestions
    interface Group {
        label: string;
        items: string[];
    }

    let props = $props();
    let {
        items = [],
        value = '',
        placeholder = '',
        maxSuggestions = 5,
        minChars = 1,
        disabled = false,
        loading = false,
        filterFn = (item: string, input: string) => 
            item.toLowerCase().includes(input.toLowerCase()),
        highlightMatches = true
    } = props;

    // State management
    let inputValue = $state(value);
    let suggestions = $state<string[]>([]);
    let selectedIndex = $state(-1);
    let showSuggestions = $state(false);
    let inputElement = $state<HTMLInputElement | null>(null);
    let debounceTimeout: number;

    // Calculate filtered suggestions
    let filteredSuggestions = $derived(
        inputValue.length < minChars 
            ? [] 
            : items
                .filter((item: string) => filterFn(item, inputValue))
                .slice(0, maxSuggestions)
    );

    // Cleanup function for debounce timeout
    onDestroy(() => {
        clearTimeout(debounceTimeout);
    });

    // Handle input with debouncing
    function handleInput() {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout((number: number) => {
            suggestions = Array.from(filteredSuggestions);
            showSuggestions = suggestions.length > 0;
            selectedIndex = -1;

            // Dispatch input event for external handlers
            const event = new CustomEvent('input', {
                detail: { value: inputValue }
            });
            inputElement?.dispatchEvent(event);
        }, 150); // 150ms debounce
    }

    // Keyboard navigation handler
    function handleKeydown(event: KeyboardEvent) {
        switch(event.key) {
            case 'ArrowDown':
                event.preventDefault();
                if (selectedIndex < suggestions.length - 1) {
                    selectedIndex++;
                    scrollSelectedIntoView();
                }
                break;
            case 'ArrowUp':
                event.preventDefault();
                if (selectedIndex > 0) {
                    selectedIndex--;
                    scrollSelectedIntoView();
                }
                break;
            case 'Enter':
                if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
                    selectSuggestion(suggestions[selectedIndex]);
                }
                break;
            case 'Escape':
                showSuggestions = false;
                selectedIndex = -1;
                break;
        }
    }

    // Helper function to scroll selected item into view
    function scrollSelectedIntoView() {
        const selectedElement = document.querySelector('.selected');
        if (selectedElement) {
            selectedElement.scrollIntoView({
                block: 'nearest',
                behavior: 'smooth'
            });
        }
    }

    // Handle suggestion selection
    function selectSuggestion(suggestion: string) {
        inputValue = suggestion;
        showSuggestions = false;
        selectedIndex = -1;
        inputElement?.focus();
        
        const event = new CustomEvent('select', {
            detail: { value: suggestion }
        });
        inputElement?.dispatchEvent(event);
    }

    // Handle blur event with delay for click handling
    function handleBlur(event: FocusEvent) {
        setTimeout(() => {
            showSuggestions = false;
            selectedIndex = -1;
        }, 200);
    }

    // Highlight matching text in suggestions
    function highlightMatch(text: string, query: string): string {
        if (!query || !highlightMatches) return text;
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }
</script>

<div class="autocomplete" role="combobox" aria-expanded={showSuggestions} aria-controls="suggestions-list" aria-haspopup="listbox">
    <input
        bind:this={inputElement}
        type="text"
        {placeholder}
        {disabled}
        bind:value={inputValue}
        oninput={handleInput}
        onkeydown={handleKeydown}
        onblur={handleBlur}
        aria-activedescendant={selectedIndex >= 0 ? `option-${selectedIndex}` : undefined}
        aria-autocomplete="list"
    />
    
    {#if showSuggestions}
        <ul
            class="suggestions"
            id="suggestions-list"
            role="listbox"
        >
            {#if loading}
                <li class="loading-indicator" aria-label="Loading suggestions">
                    <div class="spinner"></div>
                </li>
            {:else if suggestions.length === 0}
                <li class="no-results" role="status">No results found</li>
            {:else}
                {#each suggestions as suggestion, i}
                    <li
                        role="option"
                        id="option-{i}"
                        aria-selected={i === selectedIndex}
                        class:selected={i === selectedIndex}
                        onmousedown={() => selectSuggestion(suggestion)}
                    >
                        {@html highlightMatch(suggestion, inputValue)}
                    </li>
                {/each}
            {/if}
        </ul>
    {/if}
</div>

<style>
    .autocomplete {
        position: relative;
        width: 100%;
    }

    input {
        width: 100%;
        padding: var(--spacing-1);
        border: 1px solid var(--border);
        border-radius: var(--radius-1);
        background: var(--surface-1);
        color: var(--text-1);
        font: inherit;
    }

    input:focus {
        outline: none;
        border-color: var(--brand);
        box-shadow: 0 0 0 2px var(--brand-alpha);
    }

    .suggestions {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        margin: 0;
        padding: 0;
        list-style: none;
        background: var(--surface-1);
        border: 1px solid var(--border);
        border-radius: var(--radius-1);
        box-shadow: var(--shadow-2);
        max-height: 200px;
        overflow-y: auto;
        z-index: 1000;
    }

    li {
        padding: var(--spacing-1);
        cursor: pointer;
    }

    li:hover {
        background: var(--surface-2);
    }

    li.selected {
        background: var(--brand);
        color: var(--brand-contrast);
    }

    :global(mark) {
        background: var(--brand-alpha);
        color: inherit;
        padding: 0;
    }

    .loading-indicator {
        padding: var(--spacing-1);
        text-align: center;
    }

    .spinner {
        width: 20px;
        height: 20px;
        border: 2px solid var(--surface-2);
        border-top-color: var(--brand);
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto;
    }

    .no-results {
        color: var(--text-2);
        font-style: italic;
        cursor: default;
    }

    @keyframes spin {
        to { transform: rotate(360deg); }
    }
</style> 
