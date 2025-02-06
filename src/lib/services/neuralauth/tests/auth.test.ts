import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AuthService } from '../auth';
import { validateLoginCredentials, validateRegistrationData } from '../validation/schemas';
import { AUTH_CONSTANTS, ERROR_MESSAGES } from '../constants/auth';
import type { LoginCredentials, RegisterData } from '../types';

describe('Auth Validation', () => {
    describe('Login Validation', () => {
        it('should validate correct login credentials', () => {
            const credentials: LoginCredentials = {
                email: 'test@example.com',
                password: 'ValidPass123!'
            };
            const result = validateLoginCredentials(credentials);
            expect(result).toBeNull();
        });

        it('should reject invalid email', () => {
            const credentials: LoginCredentials = {
                email: 'invalid-email',
                password: 'ValidPass123!'
            };
            const result = validateLoginCredentials(credentials);
            expect(result).toBe('Invalid email format');
        });

        it('should reject short password', () => {
            const credentials: LoginCredentials = {
                email: 'test@example.com',
                password: 'short'
            };
            const result = validateLoginCredentials(credentials);
            expect(result).toBe('Password is required and must be at least 8 characters');
        });
    });

    describe('Registration Validation', () => {
        it('should validate correct registration data', () => {
            const data: RegisterData = {
                email: 'test@example.com',
                password: 'ValidPass123!',
                confirmPassword: 'ValidPass123!',
                name: 'Test User',
                acceptTerms: true
            };
            const result = validateRegistrationData(data);
            expect(result).toBeNull();
        });

        it('should reject mismatched passwords', () => {
            const data: RegisterData = {
                email: 'test@example.com',
                password: 'ValidPass123!',
                confirmPassword: 'DifferentPass123!',
                name: 'Test User',
                acceptTerms: true
            };
            const result = validateRegistrationData(data);
            expect(result).toBe('Passwords do not match');
        });
    });
});

describe('AuthService', () => {
    let authService: AuthService;
    const mockDB = {
        query: vi.fn()
    };

    beforeEach(() => {
        vi.clearAllMocks();
        authService = AuthService.getInstance(mockDB as any);
    });

    describe('Rate Limiting', () => {
        it('should block after max attempts', async () => {
            const credentials: LoginCredentials = {
                email: 'test@example.com',
                password: 'wrong'
            };

            // Simulate multiple failed attempts
            for (let i = 0; i < AUTH_CONSTANTS.MAX_LOGIN_ATTEMPTS; i++) {
                try {
                    await authService.login(credentials);
                } catch (e) {
                    // Expected to fail
                }
            }

            // Next attempt should be rate limited
            await expect(authService.login(credentials))
                .rejects
                .toThrow(ERROR_MESSAGES.RATE_LIMIT_EXCEEDED);
        });
    });
});
