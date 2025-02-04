import type { Node, Edge, GroupBox, NodeKey, EdgeKey, GroupKey, XYPair, Dimensions, Graph, GraphKey } from './logic';

// Version Types
export type Version = string;
export type VersionNumber = number;

// Serialization Types
export interface SerializedNode {
    id: NodeKey;
    label: string;
    position: XYPair;
    dimensions: Dimensions;
    inputs: number;
    outputs: number;
    properties: Record<string, unknown>;
    children?: SerializedNode[];
    internalTree?: SerializedNode[];
    metadata?: Record<string, unknown>;
    version?: Version;
}

export interface SerializedEdge {
    id: EdgeKey;
    source: string;
    target: string;
    properties: Record<string, unknown>;
    metadata?: Record<string, unknown>;
    version?: Version;
}

export interface SerializedGroup {
    id: GroupKey;
    label: string;
    position: XYPair;
    dimensions: Dimensions;
    nodes: string[];
    properties: Record<string, unknown>;
    metadata?: Record<string, unknown>;
    version?: Version;
}

export interface SerializedGraph {
    id: GraphKey;
    nodes: SerializedNode[];
    edges: SerializedEdge[];
    groups: SerializedGroup[];
    version: Version;
    metadata?: Record<string, unknown>;
    createdAt?: string;
    updatedAt?: string;
}

// Database Types
export interface DBEntity {
    createdAt: string;
    updatedAt: string;
    internalVersion: VersionNumber;
    status: 'active' | 'deleted' | 'archived';
}

export interface DBNode extends Omit<SerializedNode, 'version'>, DBEntity {
    parentId?: string;
    groupId?: string;
}

export interface DBEdge extends Omit<SerializedEdge, 'version'>, DBEntity {
    graphId: string;
}

export interface DBGroup extends Omit<SerializedGroup, 'version'>, DBEntity {
    graphId: string;
}

export interface DBGraph extends Omit<DBEntity, 'internalVersion'> {
    id: string;
    nodes: DBNode[];
    edges: DBEdge[];
    groups: DBGroup[];
    version: Version;
    internalVersion: VersionNumber;
    metadata?: Record<string, unknown>;
    owner?: string;
    permissions?: string[];
}

// Store Types
export interface ReactiveState<T> {
    value: T;
    set(value: T): void;
    update(fn: (value: T) => T): void;
    subscribe(fn: (value: T) => void): () => void;
}

export interface ReactiveMapState<K, V> {
    items: Map<K, V>;
    size: number;
    subscribe(fn: (items: Map<K, V>) => void): () => void;
}

export interface GraphStoreState {
    items: Map<string, DBGraph>;
    activeGraph: DBGraph | null;
}

export interface GraphStore {
    state: GraphStoreState;
    add(key: string, value: DBGraph): void;
    remove(key: string): void;
    get(key: string): DBGraph | undefined;
    getAll(): DBGraph[];
    clear(): void;
    setActive(key: string): void;
    subscribe(fn: (state: GraphStoreState) => void): () => void;
}

// SurrealDB Types
export interface SurrealConfig {
    url: string;
    namespace: string;
    database: string;
    credentials?: {
        username: string;
        password: string;
    };
    options?: {
        timeout?: number;
        retries?: number;
        ssl?: boolean;
    };
}

export interface QueryResult<T> {
    result: T[];
    time: string;
    status: string;
    error?: string;
}

export interface SurrealTransaction {
    query<T>(query: string, vars?: Record<string, unknown>): Promise<QueryResult<T>>;
    commit(): Promise<void>;
    rollback(): Promise<void>;
}

export interface SurrealResponse<T> {
    status: number;
    time: string;
    result: T[];
}

// Export/Import Types
export interface ExportOptions {
    format: 'json' | 'yaml' | 'binary';
    compress?: boolean;
    includeMetadata?: boolean;
    version?: Version;
    encrypt?: boolean;
    password?: string;
}

export interface ImportOptions {
    format: 'json' | 'yaml' | 'binary';
    validate?: boolean;
    upgradeVersion?: boolean;
    decrypt?: boolean;
    password?: string;
}

// Persistence Types
export interface PersistenceManager {
    save(graph: SerializedGraph, options?: ExportOptions): Promise<void>;
    load(data: string, options?: ImportOptions): Promise<SerializedGraph>;
    export(graph: SerializedGraph, options: ExportOptions): Promise<string>;
    import(data: string, options: ImportOptions): Promise<SerializedGraph>;
    validate(graph: SerializedGraph): Promise<boolean>;
    migrate(graph: SerializedGraph, toVersion: Version): Promise<SerializedGraph>;
}

// Cache Types
export interface CacheConfig {
    maxSize?: number;
    ttl?: number;
    persistToDisk?: boolean;
    compression?: boolean;
}

export interface CacheEntry<T> {
    value: T;
    timestamp: number;
    expires: number;
}

export interface Cache<K, V> {
    get(key: K): Promise<V | undefined>;
    set(key: K, value: V, ttl?: number): Promise<void>;
    delete(key: K): Promise<void>;
    clear(): Promise<void>;
    has(key: K): Promise<boolean>;
}

// History Types
export interface HistoryEntry {
    id: string;
    timestamp: string;
    action: 'create' | 'update' | 'delete';
    entityType: 'node' | 'edge' | 'group' | 'graph';
    entityId: string;
    data: Record<string, unknown>;
    user?: string;
}

export interface HistoryManager {
    add(entry: HistoryEntry): Promise<void>;
    get(id: string): Promise<HistoryEntry | undefined>;
    getAll(filter?: Partial<HistoryEntry>): Promise<HistoryEntry[]>;
    clear(): Promise<void>;
    undo(): Promise<void>;
    redo(): Promise<void>;
}

export interface InputStore {
    // TODO: Define properties and methods for InputStore
}

export interface OutputStore {
    // TODO: Define properties and methods for OutputStore
}

export type GraphDimensions = {
    width: number;
    height: number;
}