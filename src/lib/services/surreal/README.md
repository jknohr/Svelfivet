# Surreal Service Implementation

This directory contains the implementation of the SurrealDB service layer for the application. The service provides a robust interface for database operations, authentication, and real-time communication using SurrealDB and Socket.IO.

## File Structure

### 1. `surrealDBService.ts`
The core database service implementation that handles:
- Database connection and initialization
- WebSocket communication via Socket.IO
- Authentication and session management
- Query execution and error handling

Key Features:
- Singleton pattern implementation
- Fallback protocol support
- Real-time event handling
- Token-based authentication
- Error handling and custom error types

### 2. `auth.ts`
Implements authentication and user management functionality:
- User registration and login
- Session management
- Password updates and email changes
- User data retrieval
- Security features (password hashing, rate limiting)

Key Features:
- Secure password handling with Argon2
- Session token management
- User namespace isolation
- Rate limiting and account locking
- Email verification support

### 3. `init.ts`
Handles the initialization and configuration of database services:
- Protocol configuration (WS/HTTP)
- Environment-based configuration
- Service initialization
- Fallback handling

Key Features:
- Protocol auto-detection
- Environment variable support
- Fallback protocol configuration
- Service dependency injection

## Key Interfaces

### DbConfig
```typescript
interface DbConfig {
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
```

### UserAuthData
```typescript
interface UserAuthData {
    user_id: string;
    username: string;
    email: string;
    created_at: string;
    last_login?: string;
}
```

### SessionData
```typescript
interface SessionData {
    session_id: string;
    user_id: string;
    expires_at: string;
    last_active: string;
}
```

## Usage Example

```typescript
// Initialize database services
const services = await initializeDatabase();
if (services) {
    const { db, auth } = services;
    
    // Authentication
    const userData = await auth.signup(username, email, password);
    const session = await auth.login(username, password);
    
    // Database operations
    await db.query('SELECT * FROM users');
}
```

## Security Features

1. Password Security:
   - Argon2 hashing
   - Salt generation
   - Rate limiting
   - Account locking

2. Session Management:
   - UUID-based session IDs
   - Automatic expiration
   - Activity tracking
   - IP address logging

3. Namespace Isolation:
   - Per-user namespaces
   - Scoped permissions
   - Resource isolation

## Real-time Features

The service supports real-time updates through Socket.IO:
- Live query subscriptions
- Real-time authentication state
- Event-based communication
- Automatic reconnection

## Error Handling

Custom error types and comprehensive error handling for:
- Connection failures
- Authentication errors
- Query errors
- Protocol failures

## Configuration

The service can be configured through environment variables:
- `VITE_SURREAL_URL`: Database URL
- `VITE_SURREAL_NS`: Namespace
- `VITE_SURREAL_DB`: Database name
- `VITE_SURREAL_USER`: Username
- `VITE_SURREAL_PASS`: Password

## Best Practices

1. Always use the singleton instance:
   ```typescript
   const db = SurrealDBService.getInstance();
   ```

2. Handle authentication properly:
   ```typescript
   try {
       await auth.login(username, password);
   } catch (error) {
       // Handle authentication error
   }
   ```

3. Clean up event listeners:
   ```typescript
   db.off('eventName');
   ```

4. Use proper error handling:
   ```typescript
   try {
       await db.query('...');
   } catch (error) {
       if (error instanceof DatabaseError) {
           // Handle database-specific error
       }
   }
   ```
