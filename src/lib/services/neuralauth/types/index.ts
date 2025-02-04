export type User = {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    roles?: string[];
    createdAt: string;
    updatedAt: string;
};

export type LoginCredentials = {
    email: string;
    password: string;
    rememberMe?: boolean;
};

export type AuthResponse = {
    user: User;
    token: string;
    refreshToken: string;
};

export type AuthError = {
    code: string;
    message: string;
};
