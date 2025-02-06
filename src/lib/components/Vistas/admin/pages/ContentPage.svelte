<script lang="ts">
    import { $state, $props } from 'svelte';
    import BaseSection from '../pages/BaseSection.svelte';
    import BaseContentLayout from '../../../Layouts/BaseContentLayout.svelte';

    let { title = 'Content Management' } = $props();
    
    let contentItems = $state([
        { id: 1, title: 'Blog Posts', count: 0 },
        { id: 2, title: 'Pages', count: 0 },
        { id: 3, title: 'Media', count: 0 }
    ]);

    let selectedSection = $state('posts');
</script>

<BaseContentLayout {title}>
    <div class="content-management">
        <nav class="content-nav">
            <button 
                class:active={selectedSection === 'posts'}
                onclick={() => selectedSection = 'posts'}>
                Blog Posts
            </button>
            <button 
                class:active={selectedSection === 'pages'}
                onclick={() => selectedSection = 'pages'}>
                Pages
            </button>
            <button 
                class:active={selectedSection === 'media'}
                onclick={() => selectedSection = 'media'}>
                Media
            </button>
        </nav>

        <div class="content-area">
            {#if selectedSection === 'posts'}
                <BaseSection title="Blog Posts">
                    <!-- Blog posts management content -->
                </BaseSection>
            {:else if selectedSection === 'pages'}
                <BaseSection title="Pages">
                    <!-- Pages management content -->
                </BaseSection>
            {:else}
                <BaseSection title="Media">
                    <!-- Media management content -->
                </BaseSection>
            {/if}
        </div>
    </div>
</BaseContentLayout>

<style>
    .content-management {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding: 1rem;
    }

    .content-nav {
        display: flex;
        gap: 1rem;
        padding: 0.5rem;
        background: var(--surface-2);
        border-radius: 0.5rem;
    }

    .content-nav button {
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 0.25rem;
        background: transparent;
        color: var(--text-1);
        cursor: pointer;
        transition: background-color 0.2s;
    }

    .content-nav button:hover {
        background: var(--surface-3);
    }

    .content-nav button.active {
        background: var(--primary);
        color: var(--text-on-primary);
    }

    .content-area {
        background: var(--surface-1);
        border-radius: 0.5rem;
        padding: 1rem;
    }
</style>
