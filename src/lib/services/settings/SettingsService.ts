import type { 
    BaseSettings, 
    ContentSettings, 
    AISettings, 
    MonitoringSettings, 
    AutomationSettings, 
    IntegrationSettings 
} from '$lib/types/settings';

export type SettingsType = 
    | ContentSettings 
    | AISettings 
    | MonitoringSettings 
    | AutomationSettings 
    | IntegrationSettings;

export class SettingsService {
    private static instance: SettingsService;
    private cache: Map<string, SettingsType>;
    private cacheTimeout: number = 300000; // 5 minutes in milliseconds
    private lastFetch: Map<string, number>;

    private constructor() {
        this.cache = new Map();
        this.lastFetch = new Map();
    }

    public static getInstance(): SettingsService {
        if (!SettingsService.instance) {
            SettingsService.instance = new SettingsService();
        }
        return SettingsService.instance;
    }

    private isCacheValid(section: string): boolean {
        const lastFetchTime = this.lastFetch.get(section);
        if (!lastFetchTime) return false;
        return Date.now() - lastFetchTime < this.cacheTimeout;
    }

    private async fetchFromDB<T extends SettingsType>(section: string): Promise<T> {
        try {
            const result = await db.query<T>('SELECT * FROM settings WHERE section = $section', { section });
            if (!result || result.length === 0) {
                throw new Error(`No settings found for section: ${section}`);
            }
            return result[0];
        } catch (error) {
            console.error(`Error fetching settings for section ${section}:`, error);
            throw error;
        }
    }

    private async saveToCache<T extends SettingsType>(section: string, settings: T): Promise<void> {
        this.cache.set(section, settings);
        this.lastFetch.set(section, Date.now());
    }

    public async getSettings<T extends SettingsType>(section: string): Promise<T> {
        if (this.isCacheValid(section)) {
            const cachedSettings = this.cache.get(section) as T;
            if (cachedSettings) return cachedSettings;
        }

        const settings = await this.fetchFromDB<T>(section);
        await this.saveToCache(section, settings);
        return settings;
    }

    public async updateSettings<T extends SettingsType>(section: string, settings: Partial<T>): Promise<T> {
        try {
            const currentSettings = await this.getSettings<T>(section);
            const updatedSettings = {
                ...currentSettings,
                ...settings,
                lastUpdated: new Date(),
                updatedBy: 'current_user' // TODO: Get from auth context
            };

            await db.query(
                'UPDATE settings SET data = $data WHERE section = $section',
                { 
                    section, 
                    data: updatedSettings 
                }
            );

            await this.saveToCache(section, updatedSettings);
            return updatedSettings;
        } catch (error) {
            console.error(`Error updating settings for section ${section}:`, error);
            throw error;
        }
    }

    public async validateSettings<T extends SettingsType>(settings: Partial<T>): Promise<boolean> {
        // TODO: Implement validation logic based on settings type
        return true;
    }

    public clearCache(section?: string): void {
        if (section) {
            this.cache.delete(section);
            this.lastFetch.delete(section);
        } else {
            this.cache.clear();
            this.lastFetch.clear();
        }
    }

    public async migrateSettings(section: string): Promise<void> {
        // TODO: Implement settings migration logic
        throw new Error('Not implemented');
    }

    public async exportSettings(section: string): Promise<string> {
        const settings = await this.getSettings(section);
        return JSON.stringify(settings, null, 2);
    }

    public async importSettings<T extends SettingsType>(section: string, jsonSettings: string): Promise<T> {
        try {
            const settings = JSON.parse(jsonSettings) as T;
            if (await this.validateSettings(settings)) {
                return await this.updateSettings(section, settings);
            }
            throw new Error('Invalid settings format');
        } catch (error) {
            console.error(`Error importing settings for section ${section}:`, error);
            throw error;
        }
    }
}
