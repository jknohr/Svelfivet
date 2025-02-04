/**
 * Cache implementation for ID resolution with singleton pattern
 */
export class IDResolutionCache {
    private static instance: IDResolutionCache;
    private cache: Map<string, any>;

    private constructor() {
        this.cache = $state(new Map());
    }

    public static getInstance(): IDResolutionCache {
        if (!IDResolutionCache.instance) {
            IDResolutionCache.instance = new IDResolutionCache();
        }
        return IDResolutionCache.instance;
    }

    public set(id: string, data: any): void {
        this.cache.set(id, data);
    }

    public get(id: string): any | undefined {
        return this.cache.get(id);
    }

    public has(id: string): boolean {
        return this.cache.has(id);
    }

    public delete(id: string): void {
        this.cache.delete(id);
    }

    public clear(): void {
        this.cache.clear();
    }
}
