import { AUTH_CONSTANTS } from '../constants/auth';
import type { LoginCredentials, RegisterData, User } from '../types';

export function validateLoginCredentials(credentials: LoginCredentials): string | null {
    if (!AUTH_CONSTANTS.EMAIL_REGEX.test(credentials.email)) {
        return 'Invalid email format';
    }
    if (!credentials.password || credentials.password.length < AUTH_CONSTANTS.MIN_PASSWORD_LENGTH) {
        return 'Password is required and must be at least 8 characters';
    }
    return null;
}

export function validateRegistrationData(data: RegisterData): string | null {
    if (!AUTH_CONSTANTS.EMAIL_REGEX.test(data.email)) {
        return 'Invalid email format';
    }
    if (!AUTH_CONSTANTS.PASSWORD_REGEX.test(data.password)) {
        return 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character';
    }
    if (data.password !== data.confirmPassword) {
        return 'Passwords do not match';
    }
    return null;
}

export function validateUserData(user: Partial<User>): string | null {
    if (user.email && !AUTH_CONSTANTS.EMAIL_REGEX.test(user.email)) {
        return 'Invalid email format';
    }
    if (user.secondary_email && !AUTH_CONSTANTS.EMAIL_REGEX.test(user.secondary_email)) {
        return 'Invalid secondary email format';
    }
    // Add more validation as needed
    return null;
}
