import type { AuthService } from '../auth';
import { ERROR_MESSAGES } from '../constants/auth';

export type RouteGuardResult = {
    allowed: boolean;
    redirectTo?: string;
    error?: string;
};

export class AuthGuard {
    constructor(private authService: AuthService) {}

    async canActivate(requiredRoles?: string[]): Promise<RouteGuardResult> {
        const token = this.authService.getToken();
        
        if (!token) {
            return {
                allowed: false,
                redirectTo: '/login',
                error: ERROR_MESSAGES.UNAUTHORIZED
            };
        }

        try {
            const decoded = this.authService.verifyJWT(token);
            if (!decoded) {
                return {
                    allowed: false,
                    redirectTo: '/login',
                    error: ERROR_MESSAGES.TOKEN_EXPIRED
                };
            }

            if (requiredRoles && requiredRoles.length > 0) {
                const currentUser = await this.authService.getCurrentUser();
                if (!currentUser || !requiredRoles.includes(currentUser.role)) {
                    return {
                        allowed: false,
                        redirectTo: '/unauthorized',
                        error: ERROR_MESSAGES.UNAUTHORIZED
                    };
                }
            }

            return { allowed: true };
        } catch (error) {
            return {
                allowed: false,
                redirectTo: '/login',
                error: error instanceof Error ? error.message : ERROR_MESSAGES.UNAUTHORIZED
            };
        }
    }
}
