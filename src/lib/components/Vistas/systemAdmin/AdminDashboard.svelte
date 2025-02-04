<script lang="ts">
    import { UserRole, UserStatus } from './types';
    import type { User, SystemSettings } from './types';
    import { SurrealDBService } from '$lib/services/surreal/surrealDBService';
    
    let { activeTab = 'users' } = $props<{activeTab?: 'users' | 'settings' | 'logs'}>();
    let users = $state<User[]>([]);
    let isLoading = $state(false);
    let searchQuery = $state('');
    let selectedUser = $state<User | null>(null);
    let db = $state<SurrealDBService | null>(null);
    
    let settings = $state<SystemSettings>({
        siteName: 'Svelfivet',
        maintenance: false,
        registrationEnabled: true,
        defaultUserRole: UserRole.USER,
        emailVerificationRequired: true,
        maxLoginAttempts: 5,
        sessionTimeout: 3600
    });

    // Load users from database
    async function loadUsers() {
        if (!db) {
            db = SurrealDBService.getInstance();
            await db.init();
        }
        
        isLoading = true;
        try {
            const query = `
                SELECT * 
                FROM user 
                ORDER BY createdAt DESC
            `;
            const result = await db.query<User[]>(query);
            users = result[0] as User[];
        } catch (error) {
            console.error('Failed to load users:', error);
        } finally {
            isLoading = false;
        }
    }

    // Load system settings
    async function loadSettings() {
        if (!db) {
            db = SurrealDBService.getInstance();
            await db.init();
        }
        
        try {
            const query = `
                SELECT * 
                FROM system_settings 
                LIMIT 1
            `;
            const result = await db.query<SystemSettings[]>(query);
            if (result[0]?.[0]) {
                settings = result[0][0];
            }
        } catch (error) {
            console.error('Failed to load settings:', error);
        }
    }

    // Update user status
    async function updateUserStatus(userId: string, status: string) {
        if (!db) {
            db = SurrealDBService.getInstance();
            await db.init();
        }
        
        try {
            await db.query('UPDATE user SET status = $status WHERE id = $id', {
                id: userId,
                status
            });
            await loadUsers();
        } catch (error) {
            console.error('Failed to update user status:', error);
        }
    }

    // Update system settings
    async function saveSettings() {
        if (!db) {
            db = SurrealDBService.getInstance();
            await db.init();
        }
        
        try {
            await db.query('UPDATE system_settings SET * = $settings RETURN AFTER', {
                settings
            });
        } catch (error) {
            console.error('Failed to save settings:', error);
        }
    }

    // Initial load
    $effect(() => {
        loadUsers();
        loadSettings();
    });
</script>

<div class="admin-dashboard">
    <div class="tabs">
        <button 
            class:active={activeTab === 'users'} 
            onclick={() => activeTab = 'users'}
        >
            Users
        </button>
        <button 
            class:active={activeTab === 'settings'} 
            onclick={() => activeTab = 'settings'}
        >
            Settings
        </button>
    </div>

    {#if activeTab === 'users'}
        <div class="users-panel">
            <div class="search-bar">
                <input 
                    type="text" 
                    placeholder="Search users..." 
                    bind:value={searchQuery}
                />
            </div>

            <div class="users-list">
                {#if isLoading}
                    <div class="loading">Loading users...</div>
                {:else}
                    {#each users.filter(user => 
                        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        user.email.toLowerCase().includes(searchQuery.toLowerCase())
                    ) as user (user.id)}
                        <div class="user-item">
                            <div class="user-info">
                                <h3>{user.username}</h3>
                                <p>{user.email}</p>
                                <span class="role">{user.role}</span>
                                <span class="status">{user.status}</span>
                            </div>
                            <div class="actions">
                                <select 
                                    value={user.status}
                                    onchange={(e) => {
                                        const target = e.target as HTMLSelectElement;
                                        updateUserStatus(user.id, target.value as UserStatus);
                                    }}
                                >
                                    <option value="ACTIVE">Active</option>
                                    <option value="SUSPENDED">Suspended</option>
                                    <option value="INACTIVE">Inactive</option>
                                </select>
                                <button onclick={() => selectedUser = user}>
                                    Edit
                                </button>
                            </div>
                        </div>
                    {/each}
                {/if}
            </div>
        </div>
    {:else if activeTab === 'settings'}
        <div class="settings-panel">
            <div class="setting-group">
                <h3>General Settings</h3>
                <div class="setting-item">
                    <label for="siteName">Site Name</label>
                    <input id="siteName" type="text" bind:value={settings.siteName} />
                </div>
                <div class="setting-item">
                    <label for="maintenance">Maintenance Mode</label>
                    <input id="maintenance" type="checkbox" bind:checked={settings.maintenance} />
                </div>
            </div>

            <div class="setting-group">
                <h3>User Settings</h3>
                <div class="setting-item">
                    <label for="registration">Enable Registration</label>
                    <input id="registration" type="checkbox" bind:checked={settings.registrationEnabled} />
                </div>
                <div class="setting-item">
                    <label for="emailVerification">Email Verification Required</label>
                    <input id="emailVerification" type="checkbox" bind:checked={settings.emailVerificationRequired} />
                </div>
                <div class="setting-item">
                    <label for="maxAttempts">Max Login Attempts</label>
                    <input id="maxAttempts" type="number" bind:value={settings.maxLoginAttempts} min="1" max="10" />
                </div>
                <div class="setting-item">
                    <label for="timeout">Session Timeout (seconds)</label>
                    <input id="timeout" type="number" bind:value={settings.sessionTimeout} min="300" />
                </div>
            </div>

            <div class="actions">
                <button onclick={saveSettings}>Save Settings</button>
            </div>
        </div>
    {/if}
</div>

<style>
    .admin-dashboard {
        padding: 1rem;
        max-width: 1200px;
        margin: 0 auto;
    }

    .tabs {
        display: flex;
        gap: 1rem;
        margin-bottom: 2rem;
    }

    .tabs button {
        padding: 0.5rem 1rem;
        border: none;
        background: none;
        cursor: pointer;
        border-bottom: 2px solid transparent;
    }

    .tabs button.active {
        border-bottom-color: var(--primary-color);
        color: var(--primary-color);
    }

    .search-bar {
        margin-bottom: 1rem;
    }

    .search-bar input {
        width: 100%;
        padding: 0.5rem;
        border: 1px solid #ddd;
        border-radius: 4px;
    }

    .users-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .user-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        background: white;
        border-radius: 4px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    .user-info {
        display: flex;
        gap: 1rem;
        align-items: center;
    }

    .user-info h3 {
        margin: 0;
    }

    .role, .status {
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-size: 0.875rem;
    }

    .role {
        background: #e3f2fd;
        color: #1976d2;
    }

    .status {
        background: #e8f5e9;
        color: #2e7d32;
    }

    .actions {
        display: flex;
        gap: 0.5rem;
    }

    .setting-group {
        background: white;
        padding: 1rem;
        border-radius: 4px;
        margin-bottom: 1rem;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    .setting-group h3 {
        margin-top: 0;
        margin-bottom: 1rem;
    }

    .setting-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.5rem;
        padding: 0.5rem 0;
        border-bottom: 1px solid #eee;
    }

    .setting-item:last-child {
        border-bottom: none;
    }

    .setting-item label {
        font-weight: 500;
    }

    .loading {
        text-align: center;
        padding: 2rem;
        color: #666;
    }
</style>
