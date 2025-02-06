import type { VistaConfig } from '$lib/types/vista';
import type { GlassEffectConfig } from '$lib/components/Theme/Theme.types';
import { defaultGlassConfig } from '$lib/components/Theme/configs/glassConfig';
import { GlassService } from '$lib/services/surreal/glass';
import { SurrealDBService } from '$lib/services/surreal/surrealDBService';

const db = SurrealDBService.getInstance();
const glassService = new GlassService(db);

export async function loadVistaGlassConfig(vistaId: string): Promise<GlassEffectConfig> {
    try {
        return await glassService.getGlassConfig(vistaId);
    } catch (error) {
        console.error('Failed to load Vista glass config:', error);
        return defaultGlassConfig;
    }
}

export async function saveVistaGlassConfig(vistaId: string, config: GlassEffectConfig): Promise<void> {
    try {
        await glassService.saveGlassConfig(vistaId, config);
    } catch (error) {
        console.error('Failed to save Vista glass config:', error);
        throw error;
    }
}

export async function setDefaultVistaGlassConfig(vistaId: string): Promise<void> {
    try {
        await glassService.setDefaultGlassConfig(vistaId);
    } catch (error) {
        console.error('Failed to set default Vista glass config:', error);
        throw error;
    }
}

export async function deleteVistaGlassConfig(vistaId: string): Promise<void> {
    try {
        await glassService.deleteGlassConfig(vistaId);
    } catch (error) {
        console.error('Failed to delete Vista glass config:', error);
        throw error;
    }
}
