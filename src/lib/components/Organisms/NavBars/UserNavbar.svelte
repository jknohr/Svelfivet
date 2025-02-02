<svelte:options runes={true} />

<script lang="ts">
    import { slide } from 'svelte/transition';
    import { contextConfigs } from '$lib/components/Vistas/navigation';
    import type { ContextType, NavigationItem } from '$lib/types/context';
    import GlassPane from '$lib/components/Theme/GlassPane.svelte';
    import Typography from '$lib/components/Theme/Typography.svelte';
    
    // Types
    type User = {
        id: string;
        name: string;
        email: string;
        avatar?: string;
        roles?: string[];
    };

    type MenuItem = {
        id: string;
        label: string;
        icon: string;
        path: string;
        action: () => void;
    };

    // Props with defaults
    let { 
        vista = 'real-estate' as ContextType,
        user = null as User | null,
        onNavigate = ((path: string): void => {}) as (path: string) => void,
        onLogin = ((): void => {}) as () => void,
        onLogout = ((): void => {}) as () => void,
        onRegister = ((): void => {}) as () => void
    } = $props();

    // State
    let isOpen = $state(false);
    let isHovered = $state(false);
    let isActive = $state(false);

    // Derived state
    let buttonState = $derived(() => {
        if (isActive) return 'active';
        if (isHovered) return 'hover';
        return 'default';
    });

    // Convert navigation item to menu item
    function navItemToMenuItem(item: NavigationItem): MenuItem {
        return {
            id: item.path,
            label: item.label,
            icon: item.icon || '',
            path: item.path,
            action: item.onClick || (() => onNavigate(item.path))
        };
    }

    // Compute menu items
    function computeMenuItems(): MenuItem[] {
        const config = contextConfigs[vista];
        if (!config) return [];

        if (!user) {
            return [
                { 
                    id: 'login',
                    label: 'Login',
                    icon: 'login',
                    path: '/auth/login',
                    action: onLogin
                },
                {
                    id: 'register',
                    label: 'Register',
                    icon: 'person_add',
                    path: '/auth/register',
                    action: onRegister
                }
            ];
        }

        const userNav = config.navigation.user || [];
        const adminNav = user.roles?.includes('admin') ? (config.navigation.admin || []) : [];
        
        return [
            ...userNav.map(navItemToMenuItem),
            ...adminNav.map(navItemToMenuItem),
            {
                id: 'logout',
                label: 'Logout',
                icon: 'logout',
                path: '#',
                action: onLogout
            }
        ];
    }

    // Computed menu items
    let menuItems = $derived(computeMenuItems());
</script>

<div class="user-navbar-container">
    <GlassPane
        variant="light"
        state={buttonState}
        glowOnHover={true}
        componentType="button"
    >
        <button 
            class="user-button"
            onmouseenter={() => isHovered = true}
            onmouseleave={() => isHovered = false}
            onmousedown={() => isActive = true}
            onmouseup={() => isActive = false}
            onclick={() => isOpen = !isOpen}
            aria-expanded={isOpen}
            aria-haspopup="true"
        >
            {#if user}
                <div class="user-info">
                    {#if user.avatar}
                        <img 
                            src={user.avatar} 
                            alt={user.name} 
                            class="avatar"
                        />
                    {:else}
                        <span class="material-icons avatar-fallback">account_circle</span>
                    {/if}
                    <Typography size="base" weight="medium">
                        <span class="user-name">{user.name}</span>
                    </Typography>
                </div>
            {:else}
                <div class="login-info">
                    <span class="material-icons">account_circle</span>
                    <Typography size="base" weight="medium">
                        <span class="login-text">Login</span>
                    </Typography>
                </div>
            {/if}
        </button>
    </GlassPane>

    {#if isOpen}
        <div 
            class="user-menu frosted-glass" 
            role="menu" 
            aria-label="User menu"
            transition:slide={{ duration: 150 }}
        >
            {#each menuItems as item (item.id)}
                <button
                    class="menu-item"
                    onclick={() => {
                        item.action();
                        isOpen = false;
                    }}
                    role="menuitem"
                >
                    <span class="material-icons">{item.icon}</span>
                    <Typography size="sm">
                        <span class="item-label">{item.label}</span>
                    </Typography>
                </button>
            {/each}
        </div>
    {/if}
</div>

<style>
    .user-navbar-container {
        position: relative;
        height: var(--ui-unit);
        min-width: calc(var(--ui-unit) * 4);
    }

    .user-button {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        width: 100%;
        height: 100%;
        padding: 0.5rem;
        border: none;
        background: transparent;
        cursor: pointer;
        color: var(--color-text);
        transition: all 0.2s;
        border-radius: var(--radius-md);
    }

    .user-info,
    .login-info {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0 var(--ui-grid);
    }

    .avatar {
        width: 2rem;
        height: 2rem;
        border-radius: 50%;
        object-fit: cover;
    }

    .avatar-fallback {
        font-size: 2rem;
        color: var(--color-text-muted);
    }

    .user-name,
    .login-text,
    .item-label {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .user-menu {
        position: absolute;
        top: calc(100% + 0.5rem);
        right: 0;
        min-width: 200px;
        background: color-mix(in srgb, var(--color-surface) 95%, transparent);
        border: 1px solid color-mix(in srgb, var(--color-border) 50%, transparent);
        border-radius: var(--radius-md);
        box-shadow: 
            0 4px 6px color-mix(in srgb, var(--color-shadow) 10%, transparent),
            inset 0 1px 2px color-mix(in srgb, var(--color-highlight) 15%, transparent);
        padding: 0.5rem;
        transform-origin: top right;
        animation: dropdown 0.2s ease-out;
        backdrop-filter: blur(10px);
    }

    .menu-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        width: 100%;
        padding: 0.5rem 1rem;
        border: none;
        background: transparent;
        cursor: pointer;
        color: var(--color-text);
        transition: all 0.2s;
        border-radius: var(--radius-md);
    }

    .menu-item:hover {
        background: color-mix(in srgb, var(--color-primary) 5%, transparent);
        transform: translateX(4px);
    }

    .material-icons {
        font-size: 1.25rem;
        flex-shrink: 0;
    }

    @keyframes dropdown {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    /* Dark mode adjustments */
    :global([data-theme="dark"]) .user-menu {
        background: color-mix(in srgb, var(--color-surface) 97%, transparent);
        box-shadow: 
            0 4px 6px color-mix(in srgb, black 20%, transparent),
            inset 0 1px 2px color-mix(in srgb, white 5%, transparent);
    }

    /* Spatial adjustments */
    @media (--ar) {
        .user-navbar-container {
            transform-style: preserve-3d;
            transform: translateZ(var(--depth-floating));
        }
    }

    @media (--vr) {
        .user-navbar-container {
            transform-style: preserve-3d;
            transform: translateZ(var(--depth-ui));
        }
    }
</style>
