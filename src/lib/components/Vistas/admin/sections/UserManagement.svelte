<script lang="ts">
    import type { User, UserRole, UserStatus } from '../../types';
    
    let users = $state<User[]>([]);
    let isLoading = $state(false);
    let searchQuery = $state('');
    let selectedUser = $state<User | null>(null);
    let editMode = $state(false);

    // Load users from database
    async function loadUsers() {
        isLoading = true;
        try {
            const query = `
                SELECT * 
                FROM user 
                ORDER BY createdAt DESC
            `;
            const result = await db.query(query);
            users = result;
        } catch (error) {
            console.error('Failed to load users:', error);
        } finally {
            isLoading = false;
        }
    }

    // Update user status
    async function updateUserStatus(userId: string, status: UserStatus) {
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

    // Update user role
    async function updateUserRole(userId: string, role: UserRole) {
        try {
            await db.query('UPDATE user SET role = $role WHERE id = $id', {
                id: userId,
                role
            });
            await loadUsers();
        } catch (error) {
            console.error('Failed to update user role:', error);
        }
    }

    // Delete user
    async function deleteUser(userId: string) {
        if (!confirm('Are you sure you want to delete this user?')) return;
        
        try {
            await db.query('DELETE FROM user WHERE id = $id', { id: userId });
            await loadUsers();
        } catch (error) {
            console.error('Failed to delete user:', error);
        }
    }

    // Initial load
    $effect(() => {
        loadUsers();
    });
</script>

<div class="user-management">
    <header>
        <h2>User Management</h2>
        <div class="actions">
            <input 
                type="text" 
                placeholder="Search users..." 
                bind:value={searchQuery}
            />
            <button onclick={() => editMode = true}>Add User</button>
        </div>
    </header>

    <div class="users-list">
        {#if isLoading}
            <div class="loading">Loading users...</div>
        {:else}
            <table>
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Last Login</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {#each users.filter(user => 
                        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        user.email.toLowerCase().includes(searchQuery.toLowerCase())
                    ) as user (user.id)}
                        <tr>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>
                                <select 
                                    value={user.role}
                                    onchange={(e) => updateUserRole(user.id, e.target.value as UserRole)}
                                >
                                    <option value="ADMIN">Admin</option>
                                    <option value="MODERATOR">Moderator</option>
                                    <option value="USER">User</option>
                                </select>
                            </td>
                            <td>
                                <select 
                                    value={user.status}
                                    onchange={(e) => updateUserStatus(user.id, e.target.value as UserStatus)}
                                >
                                    <option value="ACTIVE">Active</option>
                                    <option value="SUSPENDED">Suspended</option>
                                    <option value="PENDING">Pending</option>
                                    <option value="INACTIVE">Inactive</option>
                                </select>
                            </td>
                            <td>{user.lastLogin || 'Never'}</td>
                            <td class="actions">
                                <button onclick={() => selectedUser = user}>Edit</button>
                                <button onclick={() => deleteUser(user.id)}>Delete</button>
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        {/if}
    </div>
</div>

<style>
    .user-management {
        background: var(--surface);
        border-radius: var(--borderRadius-md);
        box-shadow: var(--elevation-low);
        overflow: hidden;
    }

    header {
        padding: var(--spacing-md);
        border-bottom: 1px solid var(--border);
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    header h2 {
        margin: 0;
        font-size: var(--fontSize-xl);
        color: var(--textDark);
    }

    .actions {
        display: flex;
        gap: var(--spacing-md);
    }

    input[type="text"] {
        padding: var(--spacing-sm) var(--spacing-md);
        border: 1px solid var(--border);
        border-radius: var(--borderRadius-sm);
        background: var(--surface);
    }

    button {
        padding: var(--spacing-sm) var(--spacing-md);
        background: var(--primary);
        color: var(--surface);
        border: none;
        border-radius: var(--borderRadius-sm);
        cursor: pointer;
        transition: all var(--duration-fast) var(--easing-standard);
    }

    button:hover {
        background: var(--states-focus);
    }

    table {
        width: 100%;
        border-collapse: collapse;
    }

    th, td {
        padding: var(--spacing-sm) var(--spacing-md);
        text-align: left;
        border-bottom: 1px solid var(--border);
    }

    th {
        background: var(--glass-tint);
        font-weight: var(--fontWeight-medium);
        color: var(--textDark);
    }

    td select {
        padding: var(--spacing-xs) var(--spacing-sm);
        border: 1px solid var(--border);
        border-radius: var(--borderRadius-sm);
        background: var(--surface);
    }

    td.actions {
        display: flex;
        gap: var(--spacing-sm);
    }

    td.actions button:last-child {
        background: var(--states-error);
    }

    .loading {
        padding: var(--spacing-xl);
        text-align: center;
        color: var(--textLight);
    }
</style>
