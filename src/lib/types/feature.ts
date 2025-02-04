// Feature configuration type definition
export interface FeatureConfig {
    // Required fields
    enabled: boolean;

    // Optional identification fields
    id?: string;
    name?: string;
    description?: string;

    // Optional configuration fields
    provider?: string;
    dependencies?: string[];
    capabilities?: string[];
    config?: Record<string, unknown>;

    // Optional metadata
    metadata?: {
        version?: string;
        category?: string;
        tags?: string[];
        [key: string]: unknown;
    };
}
