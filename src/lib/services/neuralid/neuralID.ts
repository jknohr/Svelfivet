import { v4 as randomUUID } from 'uuid';
import type { Registry, RegistryMap } from './id-types';
import type { Version, VersionedRecord } from './id-types';

// Registry state management using $state
let dbUrlRegistry = $state<RegistryMap>({
    'A1': { code: 'A1', name: 'https://db1.example.com' },
    'A2': { code: 'A2', name: 'https://db2.example.net' }
});

// System-level namespaces for component mapping
let namespaceRegistry = $state<RegistryMap>({
    'NS1': { code: 'NS1', name: 'user_profiles' },
    'NS2': { code: 'NS2', name: 'transactions' },
    'NS3': { code: 'NS3', name: 'media_storage' }
});

// User-specific namespaces for component mapping
let userNamespaceRegistry = $state<RegistryMap>({});

// User namespace management functions for component mapping
function registerUserNamespace(userId: string): void {
    if (!userNamespaceRegistry[userId]) {
        userNamespaceRegistry[userId] = {
            code: userId,
            name: `user_${userId}_namespace`
        };
    }
}

function getUserNamespace(userId: string): Registry | undefined {
    return userNamespaceRegistry[userId];
}

function removeUserNamespace(userId: string): void {
    delete userNamespaceRegistry[userId];
}

function hasUserNamespace(userId: string): boolean {
    return userId in userNamespaceRegistry;
}

// Cache state management
let idResolutionCache = $state(new Map<string, any>());

// Registry utility functions
function addToRegistry(registry: RegistryMap, code: string, name: string, description?: string): void {
    registry[code] = { code, name, description };
}

function getFromRegistry(registry: RegistryMap, code: string): Registry | undefined {
    return registry[code];
}

function getCodeFromRegistry(registry: RegistryMap, name: string): string | undefined {
    return Object.values(registry).find(item => item.name === name)?.code;
}

// SurrealDB ID Generator for creating and parsing record IDs
class SurrealDBIDGenerator {
    /**
     * Generate a SurrealDB record ID with the format: table_id:unique_identifier
     */
    static generateID(
        dbUrlId: string,
        namespaceId: string,
        dbId: string,
        tableId: string,
        itemTypeId: string
    ): string {
        try {
            if (!tableId) throw new Error('Table ID is required');
            const uniqueId = randomUUID();
            const id = `${tableId}:${uniqueId}`;
            
            // Validate ID format
            this.parseID(id); // Will throw if invalid
            return id;
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            console.error('Error generating SurrealDB ID:', errorMessage);
            throw new Error(`Failed to generate valid SurrealDB ID: ${errorMessage}`);
        }
    }

    /**
     * Parse a SurrealDB record ID into its components
     */
    static parseID(id: string): { tableId: string; uniqueId: string } {
        const [tableId, uniqueId] = id.split(':');
        if (!tableId || !uniqueId) {
            throw new Error('Invalid SurrealDB ID format');
        }
        return { tableId, uniqueId };
    }
}

// Enhanced SurrealDB Query Builder with versioning support
class SurrealDBQueryBuilder {
    private constructor() {} // Prevent instantiation

    static createTableDefinition(tableId: string): string {
        if (!tableId) throw new Error('Table ID is required');
        
        return `
            DEFINE TABLE ${tableId} SCHEMAFULL VERSIONED;
            DEFINE FIELD id ON TABLE ${tableId} TYPE string;
            DEFINE FIELD current_version ON TABLE ${tableId} TYPE number VALUE $before.current_version OR 1;
            DEFINE FIELD versions ON TABLE ${tableId} TYPE array;
            DEFINE FIELD versions[*].version ON TABLE ${tableId} TYPE number;
            DEFINE FIELD versions[*].created_at ON TABLE ${tableId} TYPE datetime;
            DEFINE FIELD versions[*].data ON TABLE ${tableId} TYPE object;
            DEFINE FIELD versions[*].metadata ON TABLE ${tableId} TYPE object;
            DEFINE FIELD versions[*].metadata.created_by ON TABLE ${tableId} TYPE string;
            DEFINE FIELD versions[*].metadata.updated_by ON TABLE ${tableId} TYPE string OPTIONAL;
            DEFINE FIELD versions[*].metadata.change_reason ON TABLE ${tableId} TYPE string OPTIONAL;
            DEFINE FIELD metadata ON TABLE ${tableId} TYPE object;
            DEFINE FIELD metadata.namespace ON TABLE ${tableId} TYPE string;
            DEFINE FIELD metadata.db_id ON TABLE ${tableId} TYPE string;
            DEFINE FIELD metadata.table_id ON TABLE ${tableId} TYPE string;
            DEFINE FIELD metadata.type_id ON TABLE ${tableId} TYPE string;
            DEFINE FIELD metadata.created_at ON TABLE ${tableId} TYPE datetime VALUE time::now();
            DEFINE FIELD metadata.updated_at ON TABLE ${tableId} TYPE datetime VALUE time::now();
            
            -- Ensure versions are ordered
            DEFINE INDEX ${tableId}_version_idx ON TABLE ${tableId} FIELDS versions[*].version;
            -- Index for namespace queries
            DEFINE INDEX ${tableId}_namespace_idx ON TABLE ${tableId} FIELDS metadata.namespace;
            -- Index for type queries
            DEFINE INDEX ${tableId}_type_idx ON TABLE ${tableId} FIELDS metadata.type_id;
        `;
    }

    static buildSelectQuery(id: string, version?: number): string {
        const parsed = SurrealDBIDGenerator.parseID(id);
        if (version) {
            return `
                SELECT * FROM ${parsed.tableId} 
                WHERE id = "${id}"
                FETCH versions[WHERE version = ${version}];
            `;
        }
        return `
            SELECT * FROM ${parsed.tableId} 
            WHERE id = "${id}"
            FETCH versions[WHERE version = current_version];
        `;
    }

    static buildVersionHistoryQuery(id: string): string {
        const parsed = SurrealDBIDGenerator.parseID(id);
        return `
            SELECT versions FROM ${parsed.tableId}
            WHERE id = "${id}"
            ORDER BY versions[*].version DESC;
        `;
    }
}

// Cache utility functions
function setCacheItem(id: string, data: any): void {
    idResolutionCache.set(id, data);
}

function getCacheItem(id: string): any | undefined {
    return idResolutionCache.get(id);
}

function hasCacheItem(id: string): boolean {
    return idResolutionCache.has(id);
}

function deleteCacheItem(id: string): void {
    idResolutionCache.delete(id);
}

function clearCache(): void {
    idResolutionCache.clear();
}

// Record management functions
interface Version {
    version: number;
    created_at: string;
    data: any;
    metadata?: {
        created_by: string;
        updated_by?: string;
        change_reason?: string;
        db_url?: string;
        item_type?: string;
    };
}

interface VersionedRecord {
    id: string;
    current_version: number;
    versions: Version[];
    metadata?: {
        namespace: string;
        db_id: string;
        table_id: string;
        type_id: string;
        created_at?: string;
        updated_at?: string;
    };
}

interface RecordManager {
    surreal: any;
    cache: IDResolutionCache;
    createRecord(data: any, dbUrlId: string, namespaceId: string, dbId: string, tableId: string, itemTypeId: string): Promise<VersionedRecord>;
    updateRecord(id: string, data: any): Promise<VersionedRecord>;
    getRecord(id: string, version?: number): Promise<VersionedRecord | null>;
    getVersionHistory(id: string): Promise<Version[]>;
    executeQuery(query: string, params?: any): Promise<any[]>;
}

function createVersionedRecordManager(surreal: any): RecordManager {
    if (!surreal) throw new Error('SurrealDB instance is required');
    const cache = IDResolutionCache.getInstance();
    
    return {
        surreal,
        cache,

        async createRecord(
            data: any,
            dbUrlId: string,
            namespaceId: string,
            dbId: string,
            tableId: string,
            itemTypeId: string
        ): Promise<VersionedRecord> {
            try {
                if (!tableId) throw new Error('Table ID is required');
                if (!data) throw new Error('Record data is required');

                const id = SurrealDBIDGenerator.generateID(
                    dbUrlId,
                    namespaceId,
                    dbId,
                    tableId,
                    itemTypeId
                );

                const record: VersionedRecord = {
                    id,
                    current_version: 1,
                    versions: [
                        {
                            version: 1,
                            created_at: new Date().toISOString(),
                            data,
                            metadata: {
                                created_by: namespaceId,
                                db_url: dbUrlId,
                                item_type: itemTypeId
                            }
                        }
                    ],
                    metadata: {
                        namespace: namespaceId,
                        db_id: dbId,
                        table_id: tableId,
                        type_id: itemTypeId
                    }
                };

                await surreal.create(id, record);
                setCacheItem(id, record);
                return record;
            } catch (error: unknown) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                console.error('Error creating versioned record:', errorMessage);
                throw new Error(`Failed to create versioned record: ${errorMessage}`);
            }
        },

        async updateRecord(id: string, data: any): Promise<VersionedRecord> {
            const record = await this.getRecord(id);
            if (!record) throw new Error(`Record ${id} not found`);

            const newVersion = {
                version: record.current_version + 1,
                created_at: new Date().toISOString(),
                data
            };

            record.versions.push(newVersion);
            record.current_version = newVersion.version;

            await surreal.update(id, record);
            setCacheItem(id, record);
            return record;
        },

        async getRecord(id: string, version?: number): Promise<VersionedRecord | null> {
            if (this.cache.has(id)) {
                const record = this.cache.get(id);
                if (!version || version === record.current_version) return record;
            }

            const query = SurrealDBQueryBuilder.buildSelectQuery(id, version);
            const result = await this.executeQuery(query);
            return result[0] || null;
        },

        async getVersionHistory(id: string): Promise<Version[]> {
            const query = new SurrealDBQueryBuilder().buildVersionHistoryQuery(id);
            const result = await this.executeQuery(query);
            return result[0]?.versions || [];
        },

        async executeQuery(query: string, params?: any): Promise<any[]> {
            return this.surreal.query(query, params);
        }
    }
}

// Enhanced batch processing with versioning support
async function batchProcessVersionedRecords(
    manager: RecordManager,
    ids: string[],
    version?: number
): Promise<Map<string, VersionedRecord>> {
    const results = new Map<string, VersionedRecord>();
    const uncachedIds = new Set<string>();

    // Check cache first
    const cache = IDResolutionCache.getInstance();
    for (const id of ids) {
        const cached = cache.get(id);
        if (cached && (!version || version === cached.current_version)) {
            results.set(id, cached);
        } else {
            uncachedIds.add(id);
        }
    }

    if (uncachedIds.size > 0) {
        // Group by table for efficient querying
        const tableGroups = new Map<string, Set<string>>();
        
        for (const id of uncachedIds) {
            const { tableId } = SurrealDBIDGenerator.parseID(id);
            if (!tableGroups.has(tableId)) {
                tableGroups.set(tableId, new Set());
            }
            tableGroups.get(tableId)!.add(id);
        }

        // Process each table group
        for (const [tableId, groupIds] of tableGroups) {
            const query = `
                SELECT * FROM ${tableId}
                WHERE id INSIDE $ids
                ${version ? `FETCH versions[WHERE version = ${version}]` : 'FETCH versions[WHERE version = current_version]'};
            `;

            const records = await manager.executeQuery(query, {
                ids: Array.from(groupIds)
            });

            for (const record of records) {
                results.set(record.id, record);
                cache.set(record.id, record);
            }
        }
    }

    return results;
}

// Usage example with SurrealDB
async function example(surreal: any) {
    const manager = new VersionedRecordManager(surreal);

    // Create a new record
    const initialData = {
        name: "Example Image",
        url: "https://example.com/image.jpg"
    };

    const record = await manager.createRecord(
        initialData,
        'A1',
        'NS3',
        'DB1',
        'TB2',
        'IT2'
    );

    // Update the record (creates new version)
    const updatedData = {
        name: "Updated Example Image",
        url: "https://example.com/image_v2.jpg"
    };

    const updatedRecord = await manager.updateRecord(record.id, updatedData);

    // Get latest version (default behavior)
    const latest = await manager.getRecord(record.id);

    // Get specific version
    const oldVersion = await manager.getRecord(record.id, 1);

    // Get version history
    const history = await manager.getVersionHistory(record.id);

    // Batch process multiple records
    const ids = [record.id, 'A1-NS3-DB1-TB2-IT2-01H8A3Z5FQY8YX9C6Q9N3ZK1TV'];
    const batchResults = await batchProcessVersionedRecords(manager, ids);
}

// lib/stores/id-context.ts
import { getContext, setContext } from 'svelte';
import { writable, type Writable } from 'svelte/store';

export interface IDContext {
    prefix: string;
    counter: number;
    namespace?: string;
    type?: string;
    metadata?: Record<string, any>;
    context: string;
    user?: string;
    elementType: string;
}

export const ID_CONTEXT_KEY = 'id-context';

export function createIDContext(initialContext: IDContext) {
    const store = writable<IDContext>(initialContext);
    setContext(ID_CONTEXT_KEY, store);
    return store;
}

export function useIDContext(): Writable<IDContext> {
    return getContext(ID_CONTEXT_KEY);
}

// lib/utils/id-generator.ts
export function generateElementID(context: IDContext): string {
    const parts = [
        context.prefix,
        context.context,
        context.user || 'anonymous',
        context.elementType,
        crypto.randomUUID()
    ];
    
    return parts.join('-');
}

// Enhanced record management with versioning
class VersionedRecordManager {
    public surreal: any; // SurrealDB connection instance
    private cache: IDResolutionCache;

    constructor(surreal: any) {
        this.surreal = surreal;
        this.cache = IDResolutionCache.getInstance();
    }

    async createRecord(
        data: any,
        dbUrlId: string,
        namespaceId: string,
        dbId: string,
        tableId: string,
        itemTypeId: string
    ): Promise<VersionedRecord> {
        const id = SurrealDBIDGenerator.generateID(
            dbUrlId,
            namespaceId,
            dbId,
            tableId,
            itemTypeId
        );

        const initialVersion: Version = {
            version: 1,
            created_at: new Date().toISOString(),
            data: data
        };

        const record: VersionedRecord = {
            id,
            current_version: 1,
            versions: [initialVersion],
            metadata: {
                type_id: itemTypeId,
                namespace: namespaceId
            }
        };

        await this.surreal.create(tableId, record);
        this.cache.set(id, record);
        return record;
    }

    async updateRecord(
        id: string,
        data: any
    ): Promise<VersionedRecord> {
        const { tableId } = SurrealDBIDGenerator.parseID(id);
        const current = await this.getRecord(id);
        
        if (!current) {
            throw new Error(`Record ${id} not found`);
        }

        const newVersion: Version = {
            version: current.current_version + 1,
            created_at: new Date().toISOString(),
            data: data
        };

        const updatedRecord: VersionedRecord = {
            ...current,
            current_version: newVersion.version,
            versions: [...current.versions, newVersion]
        };

        await this.surreal.update(tableId, id, updatedRecord);
        this.cache.set(id, updatedRecord);
        return updatedRecord;
    }

    async getRecord(
        id: string,
        version?: number
    ): Promise<VersionedRecord | null> {
        // Check cache first
        const cached = this.cache.get(id);
        if (cached && (!version || version === cached.current_version)) {
            return cached;
        }

        const query = SurrealDBQueryBuilder.buildSelectQuery(id, version);
        const result = await this.executeQuery(query);
        
        if (result && result[0]) {
            this.cache.set(id, result[0]);
            return result[0];
        }

        return null;
    }

    async getVersionHistory(id: string): Promise<Version[]> {
        const query = SurrealDBQueryBuilder.buildVersionHistoryQuery(id);
        const result = await this.executeQuery(query);
        return result && result[0] ? result[0].versions : [];
    }

    public async executeQuery(query: string, params?: any): Promise<any[]> {
        return await this.surreal.query(query, params);
    }
}

class IDResolutionCache {
    private static instance: IDResolutionCache;
    private cache: Map<string, any>;

    private constructor() {
        this.cache = new Map();
    }

    static getInstance(): IDResolutionCache {
        if (!IDResolutionCache.instance) {
            IDResolutionCache.instance = new IDResolutionCache();
        }
        return IDResolutionCache.instance;
    }

    set(id: string, data: any): void {
        this.cache.set(id, data);
    }

    get(id: string): any | undefined {
        return this.cache.get(id);
    }

    has(id: string): boolean {
        return this.cache.has(id);
    }

    delete(id: string): void {
        this.cache.delete(id);
    }

    clear(): void {
        this.cache.clear();
    }
}

export {
    SurrealDBIDGenerator,
    SurrealDBQueryBuilder,
    IDResolutionCache,
    VersionedRecordManager,
    batchProcessVersionedRecords
};