import { SettingsService, type SettingsType } from './SettingsService';

export function useSettings<T extends SettingsType>(section: string) {
    const settings = $state<T | null>(null);
    const isLoading = $state(true);
    const error = $state<Error | null>(null);
    
    const settingsService = SettingsService.getInstance();

    async function loadSettings() {
        try {
            isLoading = true;
            error = null;
            settings = await settingsService.getSettings<T>(section);
        } catch (err) {
            error = err instanceof Error ? err : new Error('Failed to load settings');
            console.error(`Error loading ${section} settings:`, err);
        } finally {
            isLoading = false;
        }
    }

    async function updateSettings(updates: Partial<T>) {
        try {
            isLoading = true;
            error = null;
            settings = await settingsService.updateSettings<T>(section, updates);
        } catch (err) {
            error = err instanceof Error ? err : new Error('Failed to update settings');
            console.error(`Error updating ${section} settings:`, err);
        } finally {
            isLoading = false;
        }
    }

    async function exportSettings(): Promise<string> {
        try {
            return await settingsService.exportSettings(section);
        } catch (err) {
            error = err instanceof Error ? err : new Error('Failed to export settings');
            console.error(`Error exporting ${section} settings:`, err);
            throw err;
        }
    }

    async function importSettings(jsonSettings: string) {
        try {
            isLoading = true;
            error = null;
            settings = await settingsService.importSettings<T>(section, jsonSettings);
        } catch (err) {
            error = err instanceof Error ? err : new Error('Failed to import settings');
            console.error(`Error importing ${section} settings:`, err);
        } finally {
            isLoading = false;
        }
    }

    // Load settings on initialization
    $effect(() => {
        loadSettings();
    });

    return {
        settings,
        isLoading,
        error,
        updateSettings,
        exportSettings,
        importSettings,
        reload: loadSettings
    };
}
