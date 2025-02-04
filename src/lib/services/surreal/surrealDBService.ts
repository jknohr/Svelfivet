// src/services/SurrealDBService.ts
import { Surreal } from 'surrealdb.js';
import { io } from 'socket.io-client';
import type { Socket } from 'socket.io-client';
import type { ContactInfo, Language } from '$lib/schemas/auth/admin';

interface AuthCredentials {
    user: string;
    pass: string;
}

export class DatabaseError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'DatabaseError';
    }
}

export interface DbConfig {
    url: string;
    ns: string;
    db: string;
    auth?: {
        username: string;
        pass: string;
    };
    protocols?: {
        primary: string;
        fallback: string;
        port: number;
        secure: boolean;
    };
}

const DEFAULT_CONFIG: DbConfig = {
    url: 'wss://listings-069vvaqgthul1frc88ph5ovi4s.aws-euw1.surreal.cloud/rpc',
    ns: 'looking4',
    db: 'system_neural_ui',  // Replace with your database name
    auth: {
        username: 'testmonkey', // Replace with your username
        pass: 'monkeytest',     // Replace with your password
    },
};

interface SocketEventHandlers {
    [event: string]: (...args: any[]) => void;
}

export class SurrealDBService {
    private static instance: SurrealDBService | null = null;
    private config: DbConfig;
    private db: Surreal | null = null;
    private currentToken: string | null = null;
    private socket: Socket | null = null;
    private eventHandlers: SocketEventHandlers = {};

    private constructor(config: DbConfig) {
        this.config = config;
    }

    static getInstance(config?: DbConfig): SurrealDBService {
        if (!SurrealDBService.instance) {
            if (!config) {
                throw new Error('SurrealDBService not initialized. Call new SurrealDBService(config) with a config.');
            }
            SurrealDBService.instance = new SurrealDBService(config);
        }
        return SurrealDBService.instance;
    }

    async init(fallbackConfig?: DbConfig): Promise<void> {
        if (!this.db) {
            this.db = new Surreal();
            try {
                const config = fallbackConfig || this.config;
                await this.db.connect(config.url);
                if (config.auth?.username && config.auth?.pass) {
                    const token = await this.db.signin({
                        namespace: config.ns,
                        database: config.db,
                        scope: 'user',
                        username: config.auth.username,
                        password: config.auth.pass,
                    });
                    if (token) {
                        this.currentToken = token;
                    }
                }
            } catch (err) {
                console.error('Failed to connect to SurrealDB:', err instanceof Error ? err.message : String(err));
                throw new DatabaseError('Failed to connect to SurrealDB');
            }
        }

        // Initialize Socket.IO if not already initialized
        if (!this.socket) {
            const config = fallbackConfig || this.config;
            this.socket = io(config.url.replace('wss://', 'https://').replace('ws://', 'http://'), {
                transports: ['websocket'],
            });

            this.socket.on('connect', () => {
                console.log('Connected to Socket.IO server');
                if (this.currentToken) {
                    this.socket?.emit('authenticate', this.currentToken);
                }
            });

            this.socket.on('connect_error', (err) => {
                console.error('Socket.IO connection error:', err);
            });

            this.socket.on('auth_success', () => {
                console.log('Socket.IO authentication successful');
            });

            this.socket.on('auth_error', (errMsg: string) => {
                console.error('Socket.IO authentication error:', errMsg);
            });

            // Register event handlers
            for (const event in this.eventHandlers) {
                this.socket?.on(event, this.eventHandlers[event]);
            }
        }
    }

    // Method to add event handlers
    on(event: string, handler: (...args: any[]) => void): void {
        this.eventHandlers[event] = handler;
        if (this.socket) {
            this.socket.on(event, handler);
        }
    }

    // Method to remove event handlers
    off(event: string): void {
        delete this.eventHandlers[event];
        if (this.socket) {
            this.socket.off(event);
        }
    }

    // Authentication Methods
    async signup(credentials: AuthCredentials): Promise<boolean> {
        if (!this.db) {
            throw new DatabaseError('Database not initialized');
        }

        try {
            await this.db.signup({
                namespace: this.config.ns,
                database: this.config.db,
                scope: 'user',
                username: credentials.user,
                password: credentials.pass,
            });
            return true;
        } catch (error) {
            console.error('Signup failed:', error);
            throw new DatabaseError('Signup failed');
        }
    }

    async signin(credentials: AuthCredentials): Promise<boolean> {
        if (!this.db) {
            throw new DatabaseError('Database not initialized');
        }
        try {
            const token = await this.db.signin({
                namespace: this.config.ns,
                database: this.config.db,
                scope: 'user',
                username: credentials.user,
                password: credentials.pass,
            });

            if (token) {
                this.currentToken = token;
                this.socket?.emit('authenticate', token);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Signin failed:', error);
            throw new DatabaseError('Signin failed');
        }
    }

    async authenticate(token: string): Promise<boolean> {
        if (!this.db) {
            throw new DatabaseError('Database not initialized');
        }

        try {
            await this.db.authenticate(token);
            this.currentToken = token;
            this.socket?.emit('authenticate', token);
            return true;
        } catch (error) {
            console.error('Authentication failed:', error);
            throw new DatabaseError('Authentication failed');
        }
    }

    async invalidate(): Promise<void> {
        if (!this.db) {
            throw new DatabaseError('Database not initialized');
        }

        try {
            await this.db.invalidate();
            this.currentToken = null;
            this.socket?.emit('invalidate');
        } catch (error) {
            console.error('Failed to invalidate session:', error);
            throw new DatabaseError('Failed to invalidate session');
        }
    }

    // CRUD Operations
    async create<T>(thing: string, data: Partial<T>): Promise<T> {
        if (!this.db) {
            throw new DatabaseError('Database not initialized');
        }

        try {
            const result = await this.db.create(thing, data);
            return result as T;
        } catch (error) {
            console.error('Failed to create record:', error);
            throw new DatabaseError('Failed to create record');
        }
    }

    async select<T>(thing: string): Promise<T[]> {
        if (!this.db) {
            throw new DatabaseError('Database not initialized');
        }

        try {
            const result = await this.db.select(thing);
            return result as T[];
        } catch (error) {
            console.error('Failed to select records:', error);
            throw new DatabaseError('Failed to select records');
        }
    }

    async update<T>(thing: string, data: Partial<T>): Promise<T> {
        if (!this.db) {
            throw new DatabaseError('Database not initialized');
        }

        try {
            const result = await this.db.update(thing, data);
            return result as T;
        } catch (error) {
            console.error('Failed to update record:', error);
            throw new DatabaseError('Failed to update record');
        }
    }

    async delete(thing: string): Promise<void> {
        if (!this.db) {
            throw new DatabaseError('Database not initialized');
        }

        try {
            await this.db.delete(thing);
        } catch (error) {
            console.error('Failed to delete record:', error);
            throw new DatabaseError('Failed to delete record');
        }
    }

    async query<T>(query: string, vars?: Record<string, any>): Promise<T[]> {
        if (!this.db) throw new DatabaseError('Database not initialized');
        try {
            const results = await this.db.query(query, vars);
            return (results[0] || []) as T[];
        } catch (error) {
            console.error('Query failed:', error);
            throw new DatabaseError('Query failed');
        }
    }

    // Live Query
    async live<T>(thing: string, callback: (data: T) => void): Promise<void> {
        if (!this.db) {
            throw new DatabaseError('Database not initialized');
        }

        try {
            await this.db.live(thing, (data: unknown) => {
                callback(data as T);
            });
        } catch (error) {
            console.error('Failed to create live query:', error);
            throw new DatabaseError('Failed to create live query');
        }
    }

    // Socket Event Emitter
    emit(event: string, data?: any): void {
        this.socket?.emit(event, data);
    }

    // Close Connection
    async close(): Promise<void> {
        if (this.socket) {
            this.socket.disconnect();
        }
        if (this.db) {
            await this.db.close();
        }
    }
}

// src/lib/schemas/auth/surreal.ts
export const AUTH_SCHEMA = `
  DEFINE SCOPE user SESSION 24h
    SIGNUP (
      CREATE user 
      SET 
        username = $username,
        password = crypto::argon2::generate($password)
    )
    SIGNIN (
      SELECT * FROM user 
      WHERE 
        username = $username 
        AND crypto::argon2::compare(password, $password)
    );
`;

export interface SurrealAuthCredentials {
    username: string;
    password: string;
    scope?: string;
    namespace?: string;
    database?: string;
}