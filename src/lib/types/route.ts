// Route configuration type definitions
export interface RouteConfig {
    path: string;
    component?: string;
    layout?: string;
    meta?: {
        title?: string;
        description?: string;
        requiresAuth?: boolean;
        roles?: string[];
        permissions?: string[];
    };
    children?: Record<string, RouteConfig>;
}
