import type { User } from '../types';

// Auth state
export let currentUser = $state<User | null>(null);
export let isAuthenticated = $derived(!!currentUser);
export let token = $state<string | null>(null);
export let refreshToken = $state<string | null>(null);

// Load tokens from localStorage if they exist
if (typeof window !== 'undefined') {
    token = localStorage.getItem('auth_token');
    refreshToken = localStorage.getItem('auth_refresh_token');
}

// Auth actions
export function setAuthTokens(newToken: string, newRefreshToken: string) {
    token = newToken;
    refreshToken = newRefreshToken;
    
    if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', newToken);
        localStorage.setItem('auth_refresh_token', newRefreshToken);
    }
}

export function setCurrentUser(user: User | null) {
    currentUser = user;
}

export function clearAuth() {
    currentUser = null;
    token = null;
    refreshToken = null;
    
    if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_refresh_token');
    }
}
