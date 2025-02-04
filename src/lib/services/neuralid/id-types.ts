export interface Registry {
    code: string;
    name: string;
    description?: string;
}

export interface RegistryMap {
    [key: string]: Registry;
}

export interface Version {
    version: number;
    created_at: string;
    data: any;
}

export interface VersionedRecord {
    id: string;
    current_version: number;
    versions: Version[];
    [key: string]: any;
}

export interface IDContext {
    prefix: string;
    context: string;
    user?: string;
    elementType: string;
}

export interface SnippetConfig {
    id: string;
    type: string;
    allowedTypes?: string[];
    required?: boolean;
    defaultContent?: any;
}