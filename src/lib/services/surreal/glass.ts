import type { SurrealDBService } from './surrealDBService';
import type { GlassConfig, GlassEffectConfig } from '$lib/components/Theme/Theme.types';
import { defaultGlassConfig } from '$lib/components/Theme/configs/glassConfig';

export class GlassService {
    private db: SurrealDBService;

    constructor(db: SurrealDBService) {
        this.db = db;
    }

    async getGlassConfig(vistaId: string): Promise<GlassEffectConfig> {
        try {
            const query = `
                SELECT * FROM glass_configs 
                WHERE vista_id = $vista_id 
                AND user = $auth.id 
                ORDER BY created_at DESC 
                LIMIT 1;
            `;

            const response = await this.db.query(query, { vista_id: vistaId });
            const firstResult = response.result?.[0];

            if (!firstResult) {
                // Return default config if no custom config exists
                return defaultGlassConfig;
            }

            return {
                base: (firstResult as GlassEffectConfig).base,
                states: (firstResult as GlassEffectConfig).states,
                variants: (firstResult as GlassEffectConfig).variants
            };
        } catch (error) {
            console.error('Failed to get glass config:', error);
            return defaultGlassConfig;
        }
    }

    async saveGlassConfig(vistaId: string, config: GlassEffectConfig): Promise<void> {
        try {
            const query = `
                LET $existing = SELECT * FROM glass_configs 
                    WHERE vista_id = $vista_id 
                    AND user = $auth.id 
                    ORDER BY created_at DESC 
                    LIMIT 1;

                IF $existing THEN (
                    UPDATE glass_configs SET 
                        base = $base,
                        states = $states,
                        variants = $variants,
                        updated_at = time::now()
                    WHERE id = $existing[0].id
                ) ELSE (
                    CREATE glass_configs SET 
                        vista_id = $vista_id,
                        base = $base,
                        states = $states,
                        variants = $variants,
                        user = $auth.id
                );
            `;

            await this.db.query(query, {
                vista_id: vistaId,
                base: config.base,
                states: config.states,
                variants: config.variants
            });
        } catch (error) {
            console.error('Failed to save glass config:', error);
            throw new Error('Failed to save glass configuration');
        }
    }

    async setDefaultGlassConfig(vistaId: string): Promise<void> {
        try {
            const query = `
                -- Reset all default flags
                UPDATE glass_configs SET is_default = false 
                WHERE user = $auth.id;

                -- Set new default
                UPDATE glass_configs SET is_default = true 
                WHERE vista_id = $vista_id 
                AND user = $auth.id;
            `;

            await this.db.query(query, { vista_id: vistaId });
        } catch (error) {
            console.error('Failed to set default glass config:', error);
            throw new Error('Failed to set default glass configuration');
        }
    }

    async deleteGlassConfig(vistaId: string): Promise<void> {
        try {
            const query = `
                DELETE FROM glass_configs 
                WHERE vista_id = $vista_id 
                AND user = $auth.id;
            `;

            await this.db.query(query, { vista_id: vistaId });
        } catch (error) {
            console.error('Failed to delete glass config:', error);
            throw new Error('Failed to delete glass configuration');
        }
    }

    async getDefaultGlassConfig(): Promise<GlassEffectConfig> {
        try {
            const query = `
                SELECT * FROM glass_configs 
                WHERE user = $auth.id 
                AND is_default = true 
                LIMIT 1;
            `;

            const response = await this.db.query(query);
            const firstResult = response.result?.[0];

            if (!firstResult) {
                return defaultGlassConfig;
            }

            return {
                base: (firstResult as GlassEffectConfig).base,
                states: (firstResult as GlassEffectConfig).states,
                variants: (firstResult as GlassEffectConfig).variants
            };
        } catch (error) {
            console.error('Failed to get default glass config:', error);
            return defaultGlassConfig;
        }
    }
}
