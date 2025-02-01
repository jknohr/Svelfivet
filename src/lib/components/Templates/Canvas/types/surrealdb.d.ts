declare module 'surrealdb.js' {
    export class Surreal {
        constructor();
        connect(url: string): Promise<void>;
        close(): Promise<void>;
        use(params: { namespace: string; database: string }): Promise<void>;
        sign(params: { username: string; password: string }): Promise<void>;
        query<T = any>(query: string, vars?: Record<string, any>): Promise<T[]>;
        // Add other methods as needed
    }
} 