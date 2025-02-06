export interface ContactInfo {
    email: string;
    phone?: string;
    address?: string;
}

export interface Language {
    code: string;
    name: string;
    native: string;
}

export interface SurrealAuthResponse {
    token: string;
    status: 'success' | 'error';
    message?: string;
}

export interface QueryResponse<T> {
    status: 'success' | 'error';
    time: string;
    result: T[];
}

export interface TableRecord {
    id: string;
    created_at: string;
    updated_at: string;
}
