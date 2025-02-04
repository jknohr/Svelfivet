<script lang="ts">
    import { page } from '$app/stores';
    import AdminDashboard from './AdminDashboard.svelte';

    let currentPath = $state('');
    
    $effect(() => {
        currentPath = $page.url.pathname;
    });
</script>

<div class="admin-body-layout">
    {#if currentPath === '/admin' || currentPath === '/admin/dashboard'}
        <AdminDashboard />
    {:else if currentPath === '/admin/users'}
        <AdminDashboard activeTab="users" />
    {:else if currentPath === '/admin/settings'}
        <AdminDashboard activeTab="settings" />
    {:else if currentPath === '/admin/logs'}
        <div class="logs-panel">
            <h2>System Logs</h2>
            <p>Coming soon...</p>
        </div>
    {/if}
</div>

<style>
    .admin-body-layout {
        height: 100%;
        padding: 1rem;
        background-color: var(--background-color, #f5f5f5);
    }

    .logs-panel {
        background: white;
        padding: 2rem;
        border-radius: 4px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
</style>
