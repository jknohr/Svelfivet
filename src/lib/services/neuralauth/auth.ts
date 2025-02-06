import { SurrealDBService } from '$lib/services/surreal/surrealDBService';
import type { AuthResponse, LoginCredentials, RegisterData, DeviceProfile, User } from '$lib/services/neuralauth/types';
import { sign, verify } from 'jsonwebtoken';
import { AUTH_CONSTANTS, ERROR_MESSAGES } from './constants/auth';

// Simple browser environment detection
const browser = typeof window !== 'undefined';

export class AuthService {
  private static instance: AuthService;
  private readonly JWT_SECRET = process.env.JWT_SECRET || 'fallback-dev-secret';
  private readonly MAX_DEVICES = parseInt(process.env.MAX_DEVICES || '10');
  private currentUser: User | null = null;
  
  private constructor(private db: SurrealDBService) { 
    // Ensure we're using the same instance of SurrealDBService
    if (!this.db.isInitialized()) {
      throw new Error('SurrealDBService must be initialized before creating AuthService');
    }
  }

  static getInstance(db: SurrealDBService): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService(db);
    }
    return AuthService.instance;
  }

  private generateJWT(userId: string, deviceId: string): string {
    return sign(
      { userId, deviceId },
      this.JWT_SECRET,
      { expiresIn: AUTH_CONSTANTS.JWT_EXPIRY }
    );
  }

  private verifyJWT(token: string): { userId: string; deviceId: string } | null {
    try {
      return verify(token, this.JWT_SECRET) as { userId: string; deviceId: string };
    } catch {
      return null;
    }
  }

  private async getCurrentDeviceProfile(): Promise<Partial<DeviceProfile>> {
    if (!browser) return {};

    return {
      deviceName: navigator.userAgent,
      browser: navigator.userAgent,
      os: navigator.platform,
      lastLogin: new Date(),
      isCurrentDevice: true
    };
  }

  private async setToken(token: string) {
    if (browser) {
      localStorage.setItem('jwt_token', token);
      // Sync token with SurrealDB service
      await this.db.setAuthToken(token);
    }
  }

  private getToken(): string | null {
    if (browser) {
      return localStorage.getItem('jwt_token');
    }
    return null;
  }

  private clearToken() {
    if (browser) {
      localStorage.removeItem('jwt_token');
    }
  }

  private loginAttempts = new Map<string, { count: number; lastAttempt: number }>();

  private async checkRateLimit(email: string): Promise<void> {
    const attempts = this.loginAttempts.get(email) || { count: 0, lastAttempt: Date.now() };
    
    // Reset attempts if lockout duration has passed
    if (Date.now() - attempts.lastAttempt > AUTH_CONSTANTS.LOCKOUT_DURATION) {
      attempts.count = 0;
    }
    
    if (attempts.count >= AUTH_CONSTANTS.MAX_LOGIN_ATTEMPTS) {
      throw new Error(ERROR_MESSAGES.RATE_LIMIT_EXCEEDED);
    }
    
    attempts.count++;
    attempts.lastAttempt = Date.now();
    this.loginAttempts.set(email, attempts);
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const deviceProfile = await this.getCurrentDeviceProfile();

      interface UserResult {
        id: string;
        email: string;
        role: 'user' | 'admin';
        createdAt: string;
        updatedAt: string;
      }

      const results = await this.db.query<UserResult>(
        `
        LET $device = (
          CREATE device SET
            deviceName = $deviceName,
            browser = $browser,
            os = $os,
            ip = $ip,
            lastLogin = $lastLogin,
            isCurrentDevice = $isCurrentDevice
        );

        SELECT * FROM user
        WHERE email = $email
        AND crypto::argon2::compare(password, $password)
        AND array::len(->has_device->device) < $maxDevices;
        `,
        {
          ...credentials,
          ...deviceProfile,
          maxDevices: this.MAX_DEVICES
        }
      );

      const userResult = results.result?.[0];
      if (!userResult) throw new Error('Invalid credentials or max devices reached');

      const token = this.generateJWT(userResult.id, deviceProfile.id!);

      const user: User = {
        id: userResult.id,
        name: userResult.email.split('@')[0], // Use email username as name if not provided
        email: userResult.email,
        role: userResult.role,
        roles: [userResult.role],
        status: 'active',
        createdAt: new Date(userResult.createdAt).toISOString(),
        updatedAt: new Date(userResult.updatedAt).toISOString(),
        deviceCount: 0,
        verifiedEmail: false,
        twoFactorEnabled: false
      };

      this.currentUser = user;
      this.setToken(token);

      const response: AuthResponse = {
        token,
        refreshToken: token, // Using same token as refresh token for now
        expiresIn: 3600, // 1 hour expiry
        user,
        deviceProfile: deviceProfile as DeviceProfile
      };

      return response;
    } catch (error) {
      throw new Error('Login failed: ' + (error as Error).message);
    }
  }

  async logout(deviceId?: string): Promise<void> {
    try {
      const token = this.getToken();
      if (!token) return;

      const decoded = this.verifyJWT(token);
      if (!decoded) return;

      // If deviceId is provided, only remove that device
      // Otherwise remove current device
      const targetDeviceId = deviceId || decoded.deviceId;

      await this.db.query(
        `
        DELETE device 
        WHERE id = $deviceId 
        AND ->belongs_to->user.id = $userId
        `,
        { deviceId: targetDeviceId, userId: decoded.userId }
      );

      if (!deviceId || deviceId === decoded.deviceId) {
        this.clearToken();
        this.currentUser = null;
      }
    } catch (error) {
      throw new Error('Logout failed: ' + (error as Error).message);
    }
  }

  async getDeviceProfiles(): Promise<DeviceProfile[]> {
    const token = this.getToken();
    if (!token) return [];

    const decoded = this.verifyJWT(token);
    if (!decoded) return [];

    const results = await this.db.query<DeviceProfile>(
      'SELECT * FROM device WHERE ->belongs_to->user.id = $userId',
      { userId: decoded.userId }
    );

    return results.result || [];
  }
} 