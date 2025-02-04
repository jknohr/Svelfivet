<script lang="ts">
    import BaseSection from './BaseSection.svelte';
    import UserManagement from '../components/UserManagement.svelte';
    import RoleManagement from '../components/RoleManagement.svelte';
    import SystemResources from '../components/SystemResources.svelte';
    import SystemSettings from '../components/SystemSettings.svelte';
    import { createThemeComposition } from '$lib/components/Theme/ThemeComposition';

    let activeSubSection = $state('dashboard');

    // Create theme composition for system components
    const theme = createThemeComposition({
        colors: {
            primary: '#263238',
            secondary: '#37474F',
            accent: '#FF5722',
            success: '#4CAF50',
            warning: '#FFC107',
            error: '#F44336'
        }
    });

    // Define main content snippet
    const mainContent = #snippet {
        <div class="subsection-nav">
            <button 
                class:active={activeSubSection === 'dashboard'}
                onclick={() => activeSubSection = 'dashboard'}
            >
                Dashboard
            </button>
            <button 
                class:active={activeSubSection === 'users'}
                onclick={() => activeSubSection = 'users'}
            >
                Users
            </button>
            <button 
                class:active={activeSubSection === 'roles'}
                onclick={() => activeSubSection = 'roles'}
            >
                Roles
            </button>
            <button 
                class:active={activeSubSection === 'resources'}
                onclick={() => activeSubSection = 'resources'}
            >
                Resources
            </button>
            <button 
                class:active={activeSubSection === 'settings'}
                onclick={() => activeSubSection = 'settings'}
            >
                Settings
            </button>
        </div>

        <div class="subsection-content">
            {#if activeSubSection === 'dashboard'}
                <div class="dashboard-grid">
                    <div class="stat-card">
                        <h3>Total Users</h3>
                        <p class="stat">1,234</p>
                    </div>
                    <div class="stat-card">
                        <h3>Active Sessions</h3>
                        <p class="stat">56</p>
                    </div>
                    <div class="stat-card">
                        <h3>System Load</h3>
                        <p class="stat">23%</p>
                    </div>
                    <div class="stat-card">
                        <h3>Storage Used</h3>
                        <p class="stat">45%</p>
                    </div>
                </div>
            {:else if activeSubSection === 'users'}
                <UserManagement />
            {:else if activeSubSection === 'roles'}
                <RoleManagement />
            {:else if activeSubSection === 'resources'}
                <SystemResources />
            {:else if activeSubSection === 'settings'}
                <SystemSettings />
            {/if}
        </div>
    };
</script>

<BaseSection
    title="System Administration"
    description="Manage system users, roles, resources, and settings"
    mainContent={mainContent}

    <nav class="subsection-nav">
        <button 
            class:active={activeSubSection === 'dashboard'}
            onclick={() => activeSubSection = 'dashboard'}
        >
            Dashboard
        </button>
        <button 
            class:active={activeSubSection === 'users'}
            onclick={() => activeSubSection = 'users'}
        >
            Users
        </button>
        <button 
            class:active={activeSubSection === 'roles'}
            onclick={() => activeSubSection = 'roles'}
        >
            Roles
        </button>
        <button 
            class:active={activeSubSection === 'resources'}
            onclick={() => activeSubSection = 'resources'}
        >
            Resources
        </button>
        <button 
            class:active={activeSubSection === 'settings'}
            onclick={() => activeSubSection = 'settings'}
        >
            Settings
        </button>
    </nav>

    <div class="subsection-content">
        {#if activeSubSection === 'dashboard'}
            <div class="dashboard-grid">
                <div class="stat-card">
                    <h3>Total Users</h3>
                    <p class="stat">1,234</p>
                </div>
                <div class="stat-card">
                    <h3>Active Sessions</h3>
                    <p class="stat">56</p>
                </div>
                <div class="stat-card">
                    <h3>System Load</h3>
                    <p class="stat">23%</p>
                </div>
                <div class="stat-card">
                    <h3>Storage Used</h3>
                    <p class="stat">45%</p>
                </div>
            </div>
        {:else if activeSubSection === 'users'}
            <UserManagement />
        {:else if activeSubSection === 'roles'}
            <RoleManagement />
        {:else if activeSubSection === 'resources'}
            <SystemResources />
        {:else if activeSubSection === 'settings'}
            <SystemSettings />
        {/if}
    </div>
/>

<style>

    .subsection-nav {
        display: flex;
        gap: var(--spacing-sm);
        margin-bottom: var(--spacing-xl);
        padding: var(--spacing-sm);
        background: var(--glass-tint);
        border-radius: var(--borderRadius-md);
        backdrop-filter: blur(var(--glass-blur));
    }

    .subsection-nav button {
        padding: var(--spacing-sm) var(--spacing-md);
        border: none;
        background: none;
        color: var(--text);
        cursor: pointer;
        border-radius: var(--borderRadius-sm);
        transition: all var(--duration-fast) var(--easing-standard);
    }

    .subsection-nav button:hover {
        background: var(--glass-highlight);
    }

    .subsection-nav button.active {
        background: var(--surface);
        color: var(--primary);
        box-shadow: var(--elevation-low);
    }

    .dashboard-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: var(--spacing-md);
        margin-bottom: var(--spacing-xl);
    }

    .stat-card {
        padding: var(--spacing-md);
        background: var(--surface);
        border-radius: var(--borderRadius-md);
        box-shadow: var(--elevation-low);
    }

    .stat-card h3 {
        font-size: var(--fontSize-sm);
        color: var(--textLight);
        margin: 0;
    }

    .stat-card .stat {
        font-size: var(--fontSize-xxl);
        font-weight: var(--fontWeight-bold);
        color: var(--textDark);
        margin: var(--spacing-xs) 0 0;
    }
</style>
