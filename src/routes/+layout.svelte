<svelte:options runes={true} />

<script lang="ts">
    import LayoutManager from '$lib/components/Layouts/LayoutManager.svelte';
</script>

<LayoutManager>
    <slot />
</LayoutManager>
