<script lang="ts">
    import { onMount } from 'svelte';
    
    interface Props {
        threshold?: number;
        rootMargin?: string;
        once?: boolean;
        children?: any;
        placeholder?: any;
    }

    let props = $props();
    let { threshold = 0.1, rootMargin = '0px', once = true } = props;
    
    let container = $state<HTMLElement | null>(null);
    let isIntersecting = $state(false);
    let observer = $state<IntersectionObserver | null>(null);
    
    $effect(() => {
        if (!container) return;
        
        observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;
                isIntersecting = entry.isIntersecting;
                
                if (once && isIntersecting && observer) {
                    observer.disconnect();
                }
            },
            { threshold, rootMargin }
        );
        
        observer.observe(container);
        
        return () => {
            observer?.disconnect();
        };
    });
</script>

<div bind:this={container}>
    {#if isIntersecting}
        {@render props.children()}
    {:else}
        {#if props.placeholder}
            {@render props.placeholder()}
        {:else}
            <div class="lazy-placeholder"></div>
        {/if}
    {/if}
</div>

<style>
    .lazy-placeholder {
        min-height: 100px;
        background: var(--surface-2);
        border-radius: var(--radius-2);
        animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
    
    @keyframes pulse {
        0%, 100% {
            opacity: 1;
        }
        50% {
            opacity: 0.5;
        }
    }
</style> 