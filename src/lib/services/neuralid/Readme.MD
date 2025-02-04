// Example usage in App.svelte
<script lang="ts">
    import { IDProvider, IDSlot, IDElement } from './lib/components';
    import type { IDContext, SlotConfig } from './lib/types/id-types';
    
    const context: IDContext = {
        prefix: 'APP',
        context: 'dashboard',
        user: 'user123',
        elementType: 'page'
    };
    
    const headerSlot: SlotConfig = {
        id: 'header',
        type: 'header',
        allowedTypes: ['header', 'banner'],
        required: true
    };
    
    const contentSlot: SlotConfig = {
        id: 'main',
        type: 'content',
        required: true,
        defaultContent: 'Loading content...'
    };
</script>

<IDProvider {context}>
    <div class="app-layout">
        <IDSlot config={headerSlot}>
            <IDElement type="header">
                <h1>Dashboard</h1>
            </IDElement>
        </IDSlot>
        
        <IDSlot config={contentSlot}>
            <IDElement type="content-section">
                <div class="dashboard-content">
                    <!-- Dashboard content -->
                </div>
            </IDElement>
        </IDSlot>
    </div>
</IDProvider>

<style>
    .app-layout {
        display: grid;
        gap: 1rem;
        padding: 1rem;
    }
</style>