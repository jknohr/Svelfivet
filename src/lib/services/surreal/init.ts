import { SurrealDBService, type DbConfig } from './surrealDBService';
import { AuthService } from './auth';
import { browser } from '$app/environment';

type ProtocolFeature = 'live' | 'auth' | 'query';
type RpcMethod = 'query' | 'signin' | 'signup' | 'authenticate' | 'invalidate' | 'live';

// Protocol configuration matching backend capabilities
const PROTOCOLS = {
  WS: {
    SECURE: 'wss://',
    STANDARD: 'ws://',
    FEATURES: ['live', 'auth', 'query'] as ProtocolFeature[]
  },
  HTTP: {
    SECURE: 'https://',
    STANDARD: 'http://',
    FEATURES: ['query', 'auth'] as ProtocolFeature[],
    VERSION: 2  // HTTP/2 support
  },
  RPC: {
    PATH: '/rpc',
    METHODS: ['query', 'signin', 'signup', 'authenticate', 'invalidate', 'live'] as RpcMethod[]
  }
} as const;

interface ProtocolConfig {
  primary: string;
  fallback: string;
  port: number;
  secure: boolean;
  features: ProtocolFeature[];
  rpc: boolean;
}

const getProtocolConfig = (url: string): ProtocolConfig => {
  const isSecure = url.startsWith('wss://') || url.startsWith('https://');
  const isWebSocket = url.startsWith('wss://') || url.startsWith('ws://');
  const isRPC = url.endsWith('/rpc');

  return {
    primary: isWebSocket ?
      (isSecure ? PROTOCOLS.WS.SECURE : PROTOCOLS.WS.STANDARD) :
      (isSecure ? PROTOCOLS.HTTP.SECURE : PROTOCOLS.HTTP.STANDARD),
    fallback: isWebSocket ?
      (isSecure ? PROTOCOLS.HTTP.SECURE : PROTOCOLS.HTTP.STANDARD) :
      (isSecure ? PROTOCOLS.WS.SECURE : PROTOCOLS.WS.STANDARD),
    port: isSecure ? 443 : 8000,
    secure: isSecure,
    features: [...(isWebSocket ? PROTOCOLS.WS.FEATURES : PROTOCOLS.HTTP.FEATURES)],
    rpc: isRPC
  };
};

const config: DbConfig = {
  url: import.meta.env.VITE_SURREAL_URL || 'http://localhost:8000/rpc',
  ns: import.meta.env.VITE_SURREAL_NS || 'system',
  db: import.meta.env.VITE_SURREAL_DB || 'auth',
  auth: {
    username: import.meta.env.VITE_SURREAL_USER || 'root',
    pass: import.meta.env.VITE_SURREAL_PASS || 'root'
  }
};

export interface DatabaseServices {
  db: SurrealDBService;
  auth: AuthService;
}

export async function initializeDatabase(): Promise<DatabaseServices | null> {
  if (browser) {
    try {
      // Get stored auth token if it exists
      const storedToken = localStorage.getItem('auth_token');
      // Configure protocols
      const protocolConfig = getProtocolConfig(config.url);

      // Ensure URL ends with /rpc for SurrealDB
      const url = config.url.endsWith(PROTOCOLS.RPC.PATH) ?
        config.url :
        `${config.url}${PROTOCOLS.RPC.PATH}`;

      const db = SurrealDBService.getInstance({
        ...config,
        url,
        protocols: protocolConfig
      });

      // Try primary protocol first
      try {
        await db.init();
        
        // If we have a stored token, authenticate with it
        if (storedToken) {
          try {
            await db.setAuthToken(storedToken);
          } catch (error) {
            console.error('Failed to restore authentication:', error);
            // Clear invalid token
            localStorage.removeItem('auth_token');
            localStorage.removeItem('auth_refresh_token');
          }
        }
      } catch (primaryError) {
        console.warn('Primary protocol failed, trying fallback...', primaryError);
        // Try fallback protocol
        const fallbackConfig = {
          ...config,
          url: url.replace(
            protocolConfig.primary,
            protocolConfig.fallback
          )
        };
        await db.init(fallbackConfig);
      }

      const auth = new AuthService(db);
      console.log('Database services initialized successfully');
      return { db, auth };
    } catch (error) {
      console.error('Failed to initialize database services:', error);
      throw error;
    }
  }
  return null;
} 