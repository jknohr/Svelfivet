import type { LoginCredentials, AuthResponse, User } from '../types';
import { setAuthTokens, setCurrentUser, clearAuth } from '../store/auth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

async function handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'An error occurred');
    }
    return response.json();
}

export async function login(credentials: LoginCredentials): Promise<void> {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    });

    const data = await handleResponse<AuthResponse>(response);
    setAuthTokens(data.token, data.refreshToken);
    setCurrentUser(data.user);
}

export async function logout(): Promise<void> {
    try {
        await fetch(`${API_URL}/auth/logout`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
    } finally {
        clearAuth();
    }
}

export async function refreshAuthToken(): Promise<void> {
    const response = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
    });

    const data = await handleResponse<AuthResponse>(response);
    setAuthTokens(data.token, data.refreshToken);
}

export async function getCurrentUser(): Promise<User> {
    const response = await fetch(`${API_URL}/auth/me`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    const user = await handleResponse<User>(response);
    setCurrentUser(user);
    return user;
}
