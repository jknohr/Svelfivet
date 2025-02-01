import { Surreal } from 'surrealdb.js';
import type { Node, NodeConfig } from '$lib/components/Organisms/Node/Node.types';
import type { SvelteComponent } from 'svelte';

export type { Surreal };

export interface DbConfig {
    url: string;
    namespace: string;
    database: string;
}

export const DEFAULT_CONFIG: DbConfig = {
    url: 'ws://localhost:8000',
    namespace: 'svelvet',
    database: 'graphs'
};

// Database-specific types
export type RecordID = `${string}-${string}`;
export type NodeRecord = `node:${string}`;
export type AnchorRecord = `anchor:${string}`;
export type EdgeRecord = `edge:${string}`;

// Database layer for Node
export interface NodeDB extends Node {
    // Database metadata
    created_at: string;
    updated_at: string;
    version: number;
    
    // Graph relationships
    in_edges: EdgeRecord[];
    out_edges: EdgeRecord[];
    anchor_records: AnchorRecord[];
}

// Database representation of an anchor
export interface AnchorDB {
    id: AnchorRecord;
    node_id: NodeRecord;
    type: 'input' | 'output';
    index: number;
    position: { x: number; y: number };
    direction: 'north' | 'south' | 'east' | 'west';
    created_at: string;
    updated_at: string;
}

// Database representation of an edge
export interface EdgeDB {
    id: EdgeRecord;
    from_node: NodeRecord;
    to_node: NodeRecord;
    from_anchor: AnchorRecord;
    to_anchor: AnchorRecord;
    label?: string;
    style?: 'solid' | 'dashed' | 'dotted';
    color?: string;
    width?: number;
    created_at: string;
    updated_at: string;
}

// Helper type for node relationships
export interface NodeRelationship {
    id: RecordID;
    from_node: NodeRecord;
    to_node: NodeRecord;
    type: 'parent' | 'reference';
    created_at: string;
}

// Conversion functions
export function nodeToNodeDB(node: Node): Partial<NodeDB> {
    return {
        ...node,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        version: 1,
        in_edges: [],
        out_edges: [],
        anchor_records: []
    };
}

export function nodeDBToNode(nodeDB: NodeDB): Node {
    const {
        created_at,
        updated_at,
        version,
        in_edges,
        out_edges,
        anchor_records,
        ...node
    } = nodeDB;
    return node;
} 