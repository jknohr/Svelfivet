// src/services/SurrealDBService.ts
import { Surreal } from 'surrealdb.js';
import { io } from 'socket.io-client';
import type { Socket } from 'socket.io-client';
import type { ContactInfo, Language } from './types';

type LiveQueryCallback = (data: any) => void;

interface SurrealSignInParams {
    username: string;
    password: string;
}

interface SurrealAuthParams extends SurrealSignInParams {
    NS?: string;
    DB?: string;
    SC?: string;
}

interface LiveQuery {
    query: string;
    vars?: Record<string, any>;
    callback: LiveQueryCallback;
}

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

interface SurrealResponse<T> {
    status: 'OK' | 'ERR';
    result?: T;
    detail?: string;
}

export class SurrealDBService {
    private static instance: SurrealDBService | null = null;
    private config: DbConfig;
    private db: Surreal | null = null;
    private currentToken: string | null = null;
    private socket: Socket | null = null;
    private eventHandlers: SocketEventHandlers = {};
    private liveQueries: Map<string, LiveQuery> = new Map();
    private initialized: boolean = false;

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

    isInitialized(): boolean {
        return this.initialized;
    }

    async setAuthToken(token: string): Promise<void> {
        this.currentToken = token;
        if (this.db) {
            try {
                await this.db.use({ namespace: this.config.ns, database: this.config.db });
                await this.db.query('LET $token = $auth', { auth: token });
            } catch (error) {
                console.error('Failed to authenticate with token:', error);
                throw new DatabaseError('Authentication failed');
            }
        }
    }

    async subscribeLiveQuery<T>(query: string, callback: (data: T) => void, vars?: Record<string, any>): Promise<SurrealResponse<void>> {
        if (!this.db) {
            throw new DatabaseError('Database not initialized');
        }

        try {
            if (this.socket) {
                const id = crypto.randomUUID();
                this.socket.emit('live', {
                    id,
                    query,
                    vars
                });

                this.socket.on(`live:${id}`, (data: any) => {
                    callback(data);
                });
            }
            return { status: 'OK' };
        } catch (error: unknown) {
            const errorMsg = error instanceof Error ? error.message : 'Failed to subscribe to live query';
            console.error('Live query subscription failed:', errorMsg);
            return { status: 'ERR', detail: errorMsg };
        }
        return { status: 'OK' };
    }

    async clearSession(): Promise<void> {
        if (this.db) {
            try {
                // Just clear the token since invalidate is not available
                this.currentToken = null;
            } catch (error) {
                console.error('Failed to clear session:', error);
                throw new DatabaseError('Failed to clear session');
            }
        }
    }

    private setupSocket(): void {
        if (!this.socket && this.config.protocols?.primary.startsWith('ws')) {
            const socketUrl = this.config.url.replace('ws://', 'http://').replace('wss://', 'https://');
            this.socket = io(socketUrl, {
                transports: ['websocket'],
                path: '/socket.io'
            });

            this.socket.on('connect', () => {
                console.log('Socket connected');
                // Resubscribe to live queries
                this.liveQueries.forEach((query, id) => {
                    if (this.socket) {
                        this.socket.emit('live', {
                            id,
                            query: query.query,
                            vars: query.vars
                        });
                        this.socket.on(`live:${id}`, query.callback);
                    }
                });
            });

            this.socket.on('disconnect', () => {
                console.log('Socket disconnected');
            });

            this.socket.on('error', (error: Error) => {
                console.error('Socket error:', error);
            });
        }
    }



    async init(fallbackConfig?: DbConfig): Promise<void> {
        if (!this.db) {
            this.db = new Surreal();
            try {
                const config = fallbackConfig || this.config;
                await this.db.connect(config.url);
                if (config.auth?.username && config.auth?.pass) {
                    await this.db.sign({
                        username: config.auth.username,
                        password: config.auth.pass
                    });
                    
                    // Generate a session token
                    const token = crypto.randomUUID();
                    this.currentToken = token;
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
    async signup(credentials: SurrealAuthParams): Promise<SurrealResponse<void>> {
        if (!this.db) {
            throw new DatabaseError('Database not initialized');
        }

        try {
            await this.db.sign({
                username: credentials.username,
                password: credentials.password
            });
            return { status: 'OK' };
        } catch (error: unknown) {
            const errorMsg = error instanceof Error ? error.message : 'Signup failed';
            console.error('Signup failed:', errorMsg);
            return { status: 'ERR', detail: errorMsg };
        }
    }

    async signin(credentials: SurrealAuthParams): Promise<SurrealResponse<void>> {
        if (!this.db) {
            throw new DatabaseError('Database not initialized');
        }
        try {
            await this.db.use({ namespace: this.config.ns, database: this.config.db });
            await this.db.sign({
                username: credentials.username,
                password: credentials.password
            });
            
            // Generate a session token
            const token = crypto.randomUUID();
            await this.setAuthToken(token);
            this.socket?.emit('authenticate', token);
            return { status: 'OK' };
        } catch (error: unknown) {
            const errorMsg = error instanceof Error ? error.message : 'Sign in failed';
            console.error('Sign in failed:', errorMsg);
            return { status: 'ERR', detail: errorMsg };
        }
    }

    async authenticate(token: string): Promise<SurrealResponse<void>> {
        if (!this.db) {
            throw new DatabaseError('Database not initialized');
        }
        try {
            await this.db.use({ namespace: this.config.ns, database: this.config.db });
            await this.db.query('LET $token = $auth', { auth: token });
            if (this.socket) {
                this.socket.emit('authenticate', { token });
            }
            return { status: 'OK' };
        } catch (error: unknown) {
            const errorMsg = error instanceof Error ? error.message : 'Authentication failed';
            console.error('Authentication failed:', errorMsg);
            return { status: 'ERR', detail: errorMsg };
        }

    }

    async invalidate(): Promise<SurrealResponse<void>> {
        if (!this.db) {
            throw new DatabaseError('Database not initialized');
        }

        try {
            // Just clear the token since invalidate is not available
            this.currentToken = null;
            this.currentToken = null;
            this.socket?.emit('invalidate');
            return { status: 'OK' };
        } catch (error: unknown) {
            const errorMsg = error instanceof Error ? error.message : 'Failed to invalidate session';
            console.error('Failed to invalidate session:', errorMsg);
            return { status: 'ERR', detail: errorMsg };
        }
    }

    // CRUD Operations
    async create<T>(thing: string, data: Partial<T>): Promise<SurrealResponse<T>> {
        if (!this.db) {
            throw new DatabaseError('Database not initialized');
        }
        try {
            const result = await this.db.query<T[]>(`CREATE ${thing} CONTENT $data`, { data });
            return { status: 'OK', result: result[0][0] };
        } catch (error: unknown) {
            const errorMsg = error instanceof Error ? error.message : 'Create failed';
            console.error('Create failed:', errorMsg);
            return { status: 'ERR', detail: errorMsg };
        }
    }

    async select<T>(thing: string): Promise<SurrealResponse<T[]>> {
        if (!this.db) {
            throw new DatabaseError('Database not initialized');
        }
        try {
            const result = await this.db.query<T[]>(`SELECT * FROM ${thing}`);
            return { status: 'OK', result: result[0] };
        } catch (error: unknown) {
            const errorMsg = error instanceof Error ? error.message : 'Select failed';
            console.error('Select failed:', errorMsg);
            return { status: 'ERR', detail: errorMsg };
        }
    }

    async update<T>(thing: string, data: Partial<T>): Promise<SurrealResponse<T>> {
        if (!this.db) {
            throw new DatabaseError('Database not initialized');
        }
        try {
            const result = await this.db.query<T[]>(`UPDATE ${thing} MERGE $data`, { data });
            return { status: 'OK', result: result[0][0] };
        } catch (error: unknown) {
            const errorMsg = error instanceof Error ? error.message : 'Update failed';
            console.error('Update failed:', errorMsg);
            return { status: 'ERR', detail: errorMsg };
        }
    }

    async delete(thing: string): Promise<SurrealResponse<void>> {
        if (!this.db) {
            throw new DatabaseError('Database not initialized');
        }
        try {
            await this.db.query(`DELETE ${thing}`);
            return { status: 'OK' };
        } catch (error: unknown) {
            const errorMsg = error instanceof Error ? error.message : 'Delete failed';
            console.error('Delete failed:', errorMsg);
            return { status: 'ERR', detail: errorMsg };
        }
    }

    async query<T>(query: string, vars?: Record<string, any>): Promise<SurrealResponse<T[]>> {
        if (!this.db) {
            throw new DatabaseError('Database not initialized');
        }
        try {
            const result = await this.db.query<T[]>(query, vars);
            // Surreal.js query returns T[][] for queries, we need to flatten it
            const flatResult = Array.isArray(result) ? result.flat() : [];
            return { status: 'OK', result: flatResult };
        } catch (error: unknown) {
            const errorMsg = error instanceof Error ? error.message : 'Query failed';
            console.error('Query failed:', errorMsg);
            return { status: 'ERR', detail: errorMsg };
        }

    }

    // Live Query
    async watchTable<T>(table: string, callback: (data: SurrealResponse<T>) => void): Promise<SurrealResponse<void>> {
        if (!this.db) {
            throw new DatabaseError('Database not initialized');
        }

        try {
            const query = `LIVE SELECT * FROM ${table}`;
            return this.subscribeLiveQuery<T>(query, (data) => {
                callback({ status: 'OK', result: data });
            });
        } catch (error: unknown) {
            const errorMsg = error instanceof Error ? error.message : 'Failed to create live query';
            console.error('Failed to create live query:', errorMsg);
            return { status: 'ERR', detail: errorMsg };
        }
    }

    // Socket Event Emitter
    emit(event: string, data?: any): void {
        this.socket?.emit(event, data);
    }

    // Close Connection
    async close(): Promise<SurrealResponse<void>> {
        try {
            if (this.socket) {
                this.socket.disconnect();
            }
            if (this.db) {
                await this.db.close();
            }
            return { status: 'OK' };
        } catch (error: unknown) {
            const errorMsg = error instanceof Error ? error.message : 'Close failed';
            return { status: 'ERR', detail: errorMsg };
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

export interface SignInParams {
    NS?: string;
    DB?: string;
    SC?: string;
    username: string;
    password: string;
}