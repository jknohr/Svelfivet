# Neural Authentication Service

A secure, modern authentication service implementation using Svelte 5's state management features and SurrealDB. This service provides comprehensive user authentication, device management, and session handling capabilities with strong security features and TypeScript support.

## Directory Structure

```
neuralauth/
├── api/              # API endpoints and handlers
├── components/       # Reusable auth components
├── constants/        # Constants and configuration
├── middleware/       # Auth guards and middleware
├── store/            # Svelte 5 state management
├── tests/            # Unit tests
├── types/            # TypeScript type definitions
├── validation/       # Form validation schemas
├── auth.ts           # Core authentication service
├── scope.ts          # SurrealDB auth scope definitions
└── user.ts           # User type definitions
```

## Core Features

### 1. Security Features
- Rate limiting and brute force protection
- JWT-based authentication with refresh tokens
- Password strength validation
- Two-factor authentication support
- Device tracking and management
- Email verification
- Role-based access control

### 2. State Management
Uses Svelte 5's new reactivity primitives:
```typescript
export let currentUser = $state<User | null>(null);
export let isAuthenticated = $derived(!!currentUser);
export let token = $state<string | null>(null);
export let refreshToken = $state<string | null>(null);
```

Key Features:
- Reactive user state management
- Derived authentication state
- Token persistence in localStorage
- Type-safe state management with strict typing

### 3. Authentication Service

Core authentication functionality including:
- Secure JWT-based authentication
- Multi-device management with limits
- Session handling and refresh tokens
- Rate limiting and security features
- Form validation with comprehensive error handling

```typescript
class AuthService {
  // Core authentication methods
  async login(credentials: LoginCredentials): Promise<AuthResponse>
  async logout(deviceId?: string): Promise<void>
  async getDeviceProfiles(): Promise<DeviceProfile[]>
  
  // JWT handling
  private generateJWT(userId: string, deviceId: string): string
  private verifyJWT(token: string): { userId: string; deviceId: string } | null
}
```

### 3. User Management (user.ts)

Comprehensive user type definitions:
```typescript
export interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  status: UserStatus;
  verification_status: VerificationStatus;
  role: UserRole;
  // ... additional fields
}
```

Supported user statuses:
- Pending
- Active
- Suspended
- Inactive

### 4. SurrealDB Auth Scope (scope.ts)

Database-level authentication configuration:
```sql
DEFINE SCOPE user SESSION 24h
  SIGNUP (CREATE user SET username = $user, pass = crypto::argon2::generate($pass))
  SIGNIN (SELECT * FROM user WHERE username = $user AND crypto::argon2::compare(pass, $pass));
```

## Security Features

1. **JWT Security**:
   - Secure token generation
   - Token verification
   - Expiration handling
   - Refresh token support

2. **Device Management**:
   - Device tracking
   - Multi-device support
   - Device-specific sessions
   - Maximum device limit

3. **Password Security**:
   - Argon2 password hashing
   - Secure password comparison
   - Password update functionality

## Usage Examples

### 1. Basic Authentication

```typescript
// Initialize auth service
const auth = AuthService.getInstance(db);

// Login
try {
  const response = await auth.login({
    email: 'user@example.com',
    password: 'secure_password'
  });
  // Handle successful login
} catch (error) {
  // Handle login error
}

// Logout
await auth.logout();
```

### 2. State Management

```typescript
// Check authentication status
if (isAuthenticated) {
  // User is logged in
  console.log(currentUser);
}

// Update auth tokens
setAuthTokens(newToken, newRefreshToken);

// Clear authentication
clearAuth();
```

### 3. Device Management

```typescript
// Get user's devices
const devices = await auth.getDeviceProfiles();

// Logout specific device
await auth.logout(deviceId);
```

## Best Practices

1. **State Management**:
   - Use $state for reactive variables
   - Use $derived for computed values
   - Avoid direct state mutation
   - Handle persistence properly

2. **Security**:
   - Store sensitive keys in environment variables
   - Implement proper token refresh logic
   - Handle device management carefully
   - Implement rate limiting

3. **Error Handling**:
   - Implement proper error boundaries
   - Handle network errors gracefully
   - Provide meaningful error messages
   - Log security-related events

4. **Type Safety**:
   - Use TypeScript interfaces
   - Implement proper type guards
   - Validate data at runtime
   - Document type constraints

## Configuration

Environment variables needed:
```env
JWT_SECRET=your-jwt-secret
MAX_DEVICES=10
TOKEN_EXPIRY=7d
REFRESH_TOKEN_EXPIRY=30d
```

## API Integration

The service integrates with SurrealDB for data persistence and uses the following tables:
- `user`: User information
- `device`: Device tracking
- `session`: Session management

## Error Handling

The service provides custom error handling for:
- Authentication failures
- Token validation errors
- Device limit exceeded
- Network issues
- Database errors

## Event System

The service emits events for:
- Login/Logout
- Token refresh
- Device changes
- Authentication state changes

## Testing

To run the tests:
```bash
npm run test:auth
```

Test coverage includes:
- Authentication flows
- Device management
- State management
- Error scenarios
- Security features
