import { SurrealDBService } from '$lib/services/surreal/surrealDBService';
import type { AuthResponse, LoginCredentials, RegisterData, DeviceProfile, User } from '$lib/services/neuralauth/types';
import jwt from 'jsonwebtoken';

// Simple browser environment detection
const browser = typeof window !== 'undefined';

export class AuthService {
  private static instance: AuthService;
  private readonly JWT_SECRET = 'your-secret-key'; // Move to env
  private readonly MAX_DEVICES = 10;
  private currentUser: User | null = null;
  
  private constructor(private db: SurrealDBService) { }

  static getInstance(db: SurrealDBService): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService(db);
    }
    return AuthService.instance;
  }

  private generateJWT(userId: string, deviceId: string): string {
    return jwt.sign(
      { userId, deviceId },
      this.JWT_SECRET,
      { expiresIn: '7d' }
    );
  }

  private verifyJWT(token: string): { userId: string; deviceId: string } | null {
    try {
      return jwt.verify(token, this.JWT_SECRET) as { userId: string; deviceId: string };
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

  private setToken(token: string) {
    if (browser) {
      localStorage.setItem('jwt_token', token);
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

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const deviceProfile = await this.getCurrentDeviceProfile();

      interface UserResult {
        id: string;
        email: string;
        role: 'user' | 'admin';
        created: string;
        updated: string;
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

      const userResult = results[0];
      if (!userResult) throw new Error('Invalid credentials or max devices reached');

      const token = this.generateJWT(userResult.id, deviceProfile.id!);

      const user: User = {
        id: userResult.id,
        email: userResult.email,
        role: userResult.role,
        roles: [userResult.role],
        created: new Date(userResult.created),
        updated: new Date(userResult.updated),
        deviceProfiles: [],
        maxDevices: this.MAX_DEVICES
      };

      this.currentUser = user;
      this.setToken(token);

      const response: AuthResponse = {
        id: user.id,
        email: user.email,
        role: user.role,
        created: user.created.toISOString(),
        updated: user.updated.toISOString(),
        token,
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

    return results || [];
  }
} 