<svelte:options runes={true} />
<script lang="ts">
    import type { ComponentProps } from 'svelte';
    import LayoutManager from '$lib/components/Layouts/LayoutManager.svelte';

    const mainContent = $props<{ children: any }>();
</script>

<LayoutManager>
    <div class="page-content">
        {@render mainContent.children()}
    </div>
</LayoutManager>
