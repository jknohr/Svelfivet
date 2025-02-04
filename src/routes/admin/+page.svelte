<svelte:options runes={true} />

<script lang="ts">
    import AdminBody from '$lib/components/Vistas/admin/AdminBody.svelte';
</script>

<AdminBody />

<style>
    :global(body) {
        margin: 0;
        padding: 0;
        height: 100vh;
        width: 100vw;
        overflow: hidden;
    }
</style>
