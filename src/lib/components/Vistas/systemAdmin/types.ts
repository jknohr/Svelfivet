export interface User {
    id: string;
    username: string;
    email: string;
    role: UserRole;
    status: UserStatus;
    createdAt: string;
    lastLogin?: string;
}

export enum UserRole {
    ADMIN = 'ADMIN',
    MODERATOR = 'MODERATOR',
    USER = 'USER'
}

export enum UserStatus {
    ACTIVE = 'ACTIVE',
    SUSPENDED = 'SUSPENDED',
    PENDING = 'PENDING',
    INACTIVE = 'INACTIVE'
}

export interface SystemSettings {
    siteName: string;
    maintenance: boolean;
    registrationEnabled: boolean;
    defaultUserRole: UserRole;
    emailVerificationRequired: boolean;
    maxLoginAttempts: number;
    sessionTimeout: number;
}
