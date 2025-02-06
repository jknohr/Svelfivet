import type { User } from '../types';
import { SurrealDBService } from '$lib/services/surreal/surrealDBService';

// Auth state
export let currentUser = $state<User | null>(null);
export let isAuthenticated = $derived(!!currentUser);
export let token = $state<string | null>(null);
export let refreshToken = $state<string | null>(null);

// Initialize state from both localStorage and SurrealDB
async function initializeAuthState() {
    if (typeof window !== 'undefined') {
        token = localStorage.getItem('auth_token');
        refreshToken = localStorage.getItem('auth_refresh_token');
        
        // Sync with SurrealDB if we have a token
        if (token) {
            const db = SurrealDBService.getInstance();
            await db.setAuthToken(token);
        }
    }
}

// Auth actions
export async function setAuthTokens(newToken: string, newRefreshToken: string) {
    token = newToken;
    refreshToken = newRefreshToken;
    
    if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', newToken);
        localStorage.setItem('auth_refresh_token', newRefreshToken);
        
        // Sync with SurrealDB
        const db = SurrealDBService.getInstance();
        await db.setAuthToken(newToken);
    }
}

export function setCurrentUser(user: User | null) {
    currentUser = user;
}

export async function clearAuth() {
    currentUser = null;
    token = null;
    refreshToken = null;
    
    if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_refresh_token');
        
        // Clear SurrealDB session
        const db = SurrealDBService.getInstance();
        await db.clearSession();
    }
}

// Initialize auth state when the store is loaded
initializeAuthState();
