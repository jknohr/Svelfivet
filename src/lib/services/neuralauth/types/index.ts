export type UserRole = 'user' | 'admin' | 'superadmin';

export type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending';

export type User = {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    role: UserRole;
    roles: UserRole[];
    status: UserStatus;
    createdAt: string;
    updatedAt: string;
    lastLoginAt?: string;
    deviceCount: number;
    verifiedEmail: boolean;
    twoFactorEnabled: boolean;
};

export type DeviceProfile = {
    id: string;
    deviceName: string;
    browser: string;
    os: string;
    lastLogin: Date;
    isCurrentDevice: boolean;
    ip?: string;
};

export type LoginCredentials = {
    email: string;
    password: string;
    rememberMe?: boolean;
    deviceProfile?: Partial<DeviceProfile>;
    twoFactorToken?: string;
};

export type AuthResponse = {
    user: User;
    token: string;
    refreshToken: string;
    expiresIn: number;
    deviceProfile: DeviceProfile;
};

export type TokenPayload = {
    userId: string;
    deviceId: string;
    role: UserRole;
    exp: number;
    iat: number;
};

export type RegisterData = {
    email: string;
    password: string;
    confirmPassword: string;
    name: string;
    acceptTerms: boolean;
};

export type AuthError = {
    code: string;
    message: string;
    field?: string;
    timestamp: string;
    requestId?: string;
};

export type ValidationResult = {
    valid: boolean;
    errors: Record<string, string>;
};
