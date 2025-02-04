import type { SurrealDBService } from './surrealDBService';

export interface UserAuthData {
    user_id: string;
    username: string;
    email: string;
    created_at: string;
    last_login?: string;
}

export interface SessionData {
    session_id: string;
    user_id: string;
    expires_at: string;
    last_active: string;
}

export class AuthService {
    private db: SurrealDBService;

    constructor(db: SurrealDBService) {
        this.db = db;
    }

    async signup(username: string, email: string, password: string): Promise<UserAuthData> {
        try {
            // Generate a unique user ID
            const user_id = crypto.randomUUID();

            // Create user in the system namespace's user_auth_index
            const query = `
                LET $user = CREATE user_auth_index SET 
                    user_id = $user_id,
                    username = $username,
                    email = $email,
                    password_hash = crypto::argon2::generate($password),
                    salt = rand::uuid(),
                    login_attempts = 0,
                    created_at = time::now(),
                    updated_at = time::now();
                RETURN $user;
            `;

            const [result] = await this.db.query<UserAuthData>(query, {
                user_id,
                username,
                email,
                password
            });

            if (!result) {
                throw new Error('Failed to create user');
            }

            // Create user's personal namespace
            await this.db.query(`
                USE NS system;
                CREATE NAMESPACE user_${user_id};
                USE NS user_${user_id};
                DEFINE DATABASE profile;
            `);

            return result;
        } catch (error) {
            console.error('Signup failed:', error);
            throw new Error('Signup failed');
        }
    }

    async login(identifier: string, password: string): Promise<{ user: UserAuthData; session: SessionData }> {
        try {
            // Verify credentials and create session
            const query = `
                LET $user = SELECT * FROM user_auth_index 
                    WHERE (username = $identifier OR email = $identifier) 
                    AND (locked_until IS NONE OR locked_until <= time::now());

                LET $auth = SELECT * FROM $user[0] 
                    WHERE crypto::argon2::compare(password_hash, $password);

                LET $session = CREATE user_sessions SET 
                    session_id = rand::uuid(),
                    user_id = $auth[0].user_id,
                    token = rand::uuid(),
                    created_at = time::now(),
                    expires_at = time::now() + 24h,
                    last_active = time::now(),
                    ip_address = $ip_address;

                LET $update = UPDATE user_auth_index 
                    SET login_attempts = 0, 
                        last_login = time::now(),
                        locked_until = NONE,
                        updated_at = time::now()
                    WHERE id = $auth[0].id;

                RETURN {
                    user: $auth[0],
                    session: $session
                };
            `;

            const [result] = await this.db.query<{ user: UserAuthData; session: SessionData }>(
                query,
                {
                    identifier,
                    password,
                    ip_address: window.location.hostname // For demo; in production use proper IP detection
                }
            );

            if (!result?.user || !result?.session) {
                throw new Error('Invalid credentials');
            }

            // Store the session token
            this.db.emit('authenticate', result.session.session_id);

            return result;
        } catch (error) {
            console.error('Login failed:', error);
            throw new Error('Login failed');
        }
    }

    async logout(session_id: string): Promise<void> {
        try {
            await this.db.query('DELETE FROM user_sessions WHERE session_id = $session_id', {
                session_id
            });
            this.db.emit('invalidate');
        } catch (error) {
            console.error('Logout failed:', error);
            throw new Error('Logout failed');
        }
    }

    async validateSession(session_id: string): Promise<SessionData | null> {
        try {
            const query = `
                LET $session = SELECT * FROM user_sessions 
                    WHERE session_id = $session_id 
                    AND expires_at > time::now();

                LET $update = UPDATE user_sessions 
                    SET last_active = time::now() 
                    WHERE session_id = $session_id;

                RETURN $session[0];
            `;

            const [result] = await this.db.query<SessionData>(query, { session_id });
            return result || null;
        } catch (error) {
            console.error('Session validation failed:', error);
            return null;
        }
    }

    async getUserData(user_id: string): Promise<UserAuthData | null> {
        try {
            const [result] = await this.db.query<UserAuthData>(
                'SELECT user_id, username, email, created_at, last_login FROM user_auth_index WHERE user_id = $user_id',
                { user_id }
            );
            return result || null;
        } catch (error) {
            console.error('Failed to get user data:', error);
            return null;
        }
    }

    async updatePassword(user_id: string, current_password: string, new_password: string): Promise<boolean> {
        try {
            const query = `
                LET $user = SELECT * FROM user_auth_index 
                    WHERE user_id = $user_id 
                    AND crypto::argon2::compare(password_hash, $current_password);

                LET $update = UPDATE user_auth_index 
                    SET password_hash = crypto::argon2::generate($new_password),
                        updated_at = time::now()
                    WHERE id = $user[0].id;

                RETURN $update;
            `;

            const [result] = await this.db.query(query, {
                user_id,
                current_password,
                new_password
            });

            return !!result;
        } catch (error) {
            console.error('Password update failed:', error);
            throw new Error('Password update failed');
        }
    }

    async updateEmail(user_id: string, new_email: string, password: string): Promise<boolean> {
        try {
            const query = `
                LET $user = SELECT * FROM user_auth_index 
                    WHERE user_id = $user_id 
                    AND crypto::argon2::compare(password_hash, $password);

                LET $update = UPDATE user_auth_index 
                    SET email = $new_email,
                        updated_at = time::now()
                    WHERE id = $user[0].id;

                RETURN $update;
            `;

            const [result] = await this.db.query(query, {
                user_id,
                new_email,
                password
            });

            return !!result;
        } catch (error) {
            console.error('Email update failed:', error);
            throw new Error('Email update failed');
        }
    }
} 