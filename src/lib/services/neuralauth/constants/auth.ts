export const AUTH_CONSTANTS = {
    JWT_EXPIRY: '7d',
    MIN_PASSWORD_LENGTH: 8,
    MAX_LOGIN_ATTEMPTS: 5,
    LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes in milliseconds
    MAX_DEVICES: 10,
    PASSWORD_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
} as const;

export const ERROR_MESSAGES = {
    INVALID_EMAIL: 'Please enter a valid email address',
    INVALID_PASSWORD: 'Password must be at least 8 characters long and contain uppercase, lowercase, number and special character',
    MAX_DEVICES_REACHED: 'Maximum number of devices reached',
    INVALID_CREDENTIALS: 'Invalid email or password',
    RATE_LIMIT_EXCEEDED: 'Too many login attempts. Please try again later',
    TOKEN_EXPIRED: 'Your session has expired. Please login again',
    UNAUTHORIZED: 'Unauthorized access',
} as const;
