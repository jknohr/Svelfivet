// lib/services/neuralid/id-relations.ts

export interface IDRelation {
    type: 'contains' | 'references' | 'depends_on' | 'interacts_with';
    metadata?: Record<string, any>;
    created_at?: string;
    updated_at?: string;
    strength?: number;
    bidirectional?: boolean;
}

export interface IDNode {
    id: string;
    type: string;
    context: string;
    namespace: string;
    metadata?: Record<string, any>;
    userState?: string;
    version?: number;
    created_at?: string;
    updated_at?: string;
}

// Schema definitions for SurrealDB tables
export const SCHEMA_DEFINITIONS = {
    // Shared reference tables (global space)
    SHARED_REFS: `
        -- Define shared reference table
        DEFINE TABLE shared_refs SCHEMAFULL;
        DEFINE FIELD type ON shared_refs TYPE string;
        DEFINE FIELD category ON shared_refs TYPE string;
        DEFINE FIELD content ON shared_refs TYPE object;
        DEFINE FIELD metadata ON shared_refs TYPE object;
        DEFINE FIELD is_template ON shared_refs TYPE bool DEFAULT false;
        DEFINE FIELD template_version ON shared_refs TYPE number DEFAULT 1;
        DEFINE FIELD created_at ON shared_refs TYPE datetime VALUE time::now();
        DEFINE FIELD updated_at ON shared_refs TYPE datetime VALUE time::now();
        
        -- Indexes for efficient querying
        DEFINE INDEX idx_refs_type ON shared_refs FIELDS type;
        DEFINE INDEX idx_refs_category ON shared_refs FIELDS category;
        DEFINE INDEX idx_refs_template ON shared_refs FIELDS is_template;
        
        -- Ensure unique combinations
        DEFINE INDEX idx_refs_unique ON shared_refs COLUMNS type, category UNIQUE WHERE is_template = true;
    `,
    
    // User-specific reference tables
    USER_REFS: `
        -- Define user reference table
        DEFINE TABLE user_refs SCHEMAFULL;
        DEFINE FIELD user_id ON user_refs TYPE string;
        DEFINE FIELD type ON user_refs TYPE string;
        DEFINE FIELD category ON user_refs TYPE string;
        DEFINE FIELD content ON user_refs TYPE object;
        DEFINE FIELD metadata ON user_refs TYPE object;
        DEFINE FIELD source_template ON user_refs TYPE record<shared_refs>;
        DEFINE FIELD template_version ON user_refs TYPE number;
        DEFINE FIELD created_at ON user_refs TYPE datetime VALUE time::now();
        DEFINE FIELD updated_at ON user_refs TYPE datetime VALUE time::now();
        
        -- Indexes for efficient querying
        DEFINE INDEX idx_user_refs_user ON user_refs FIELDS user_id;
        DEFINE INDEX idx_user_refs_type ON user_refs FIELDS type;
        DEFINE INDEX idx_user_refs_category ON user_refs FIELDS category;
        
        -- Ensure unique combinations per user
        DEFINE INDEX idx_user_refs_unique ON user_refs COLUMNS user_id, type, category UNIQUE;
    `,
    
    NODES: `
        -- Define versioned table for nodes
        DEFINE TABLE nodes SCHEMAFULL VERSIONED;
        
        -- Base fields
        DEFINE FIELD type ON nodes TYPE string;
        DEFINE FIELD context ON nodes TYPE string;
        DEFINE FIELD namespace ON nodes TYPE string;
        DEFINE FIELD metadata ON nodes TYPE object;
        DEFINE FIELD userState ON nodes TYPE string;
        
        -- Version tracking (handled by SurrealDB VERSIONED)
        DEFINE FIELD created_at ON nodes TYPE datetime VALUE time::now();
        DEFINE FIELD updated_at ON nodes TYPE datetime VALUE time::now();
        
        -- Indexes for efficient querying
        DEFINE INDEX idx_nodes_type ON nodes FIELDS type;
        DEFINE INDEX idx_nodes_context ON nodes FIELDS context;
        DEFINE INDEX idx_nodes_namespace ON nodes FIELDS namespace;
        
        -- Version history access
        DEFINE FIELD history ON nodes TYPE array;
        DEFINE FIELD history.* ON nodes TYPE object;
        DEFINE FIELD history.*.version ON nodes TYPE number;
        DEFINE FIELD history.*.timestamp ON nodes TYPE datetime;
        DEFINE FIELD history.*.changes ON nodes TYPE object;
        DEFINE FIELD history.*.author ON nodes TYPE string;
    `,
    RELATIONS: `
        -- Define versioned table for relations
        DEFINE TABLE relations SCHEMAFULL VERSIONED;
        
        -- Core relation fields
        DEFINE FIELD type ON relations TYPE string
            ASSERT $value INSIDE ['contains', 'references', 'depends_on', 'interacts_with'];
        DEFINE FIELD in ON relations TYPE record<nodes>;
        DEFINE FIELD out ON relations TYPE record<nodes>;
        DEFINE FIELD metadata ON relations TYPE object;
        DEFINE FIELD strength ON relations TYPE number DEFAULT 1;
        DEFINE FIELD bidirectional ON relations TYPE bool DEFAULT false;
        
        -- Timestamps
        DEFINE FIELD created_at ON relations TYPE datetime VALUE time::now();
        DEFINE FIELD updated_at ON relations TYPE datetime VALUE time::now();
        
        -- Ensure unique relations
        DEFINE INDEX idx_relations_unique ON relations COLUMNS in, out, type UNIQUE;
        
        -- Optimized indexes
        DEFINE INDEX idx_relations_type ON relations FIELDS type;
        DEFINE INDEX idx_relations_in ON relations FIELDS in;
        DEFINE INDEX idx_relations_out ON relations FIELDS out;
        
        -- Analytics tracking
        DEFINE FIELD analytics ON relations TYPE object {
            access_count: number,
            last_accessed: datetime,
            version_count: number
        };
        
        -- Version history
        DEFINE FIELD history ON relations TYPE array;
        DEFINE FIELD history.* ON relations TYPE object;
        DEFINE FIELD history.*.version ON relations TYPE number;
        DEFINE FIELD history.*.timestamp ON relations TYPE datetime;
        DEFINE FIELD history.*.changes ON relations TYPE object;
        DEFINE FIELD history.*.author ON relations TYPE string;
    `
};

export type LiveUpdateCallback = (data: any) => void;

// SurrealDB queries for managing ID relationships
export class IDRelationManager {
    private liveSubscriptions: Map<string, {
        unsubscribe: () => void;
        retryCount: number;
        lastError?: Error;
    }> = new Map();

    constructor(private surreal: any, private namespace: string) {}

    private get nodesTable() {
        return 'nodes';
    }

    private get relationsTable() {
        return 'relations';
    }

    async initializeSchema(): Promise<void> {
        try {
            // Create nodes table with versioning
            await this.surreal.query(SCHEMA_DEFINITIONS.NODES);
            
            // Create unified relations table
            await this.surreal.query(SCHEMA_DEFINITIONS.RELATIONS);
        } catch (error) {
            console.error('Failed to initialize schema:', error);
            throw new Error('Schema initialization failed');
        }
    }

    private async handleLiveQueryError(subscriptionId: string, error: Error): Promise<void> {
        const subscription = this.liveSubscriptions.get(subscriptionId);
        if (!subscription) return;

        subscription.lastError = error;
        subscription.retryCount++;

        if (subscription.retryCount <= 3) {
            console.warn(`Live query error for ${subscriptionId}, retrying... (attempt ${subscription.retryCount}/3)`);
            // Implement exponential backoff
            await new Promise(resolve => setTimeout(resolve, Math.pow(2, subscription.retryCount) * 1000));
            // Retry logic would go here
        } else {
            console.error(`Live query for ${subscriptionId} failed after 3 attempts`, error);
            this.liveSubscriptions.delete(subscriptionId);
        }
    }

    async createNode(node: IDNode): Promise<string> {
        const query = `
            -- Create new versioned node
            CREATE ${this.nodesTable}:${node.id} 
            SET 
                type = $type,
                context = $context,
                namespace = $namespace,
                metadata = $metadata,
                userState = $userState,
                created_at = time::now(),
                updated_at = time::now(),
                history = [{
                    version: 1,
                    timestamp: time::now(),
                    changes: $metadata,
                    author: $author
                }]
            RETURN id;
        `;
        
        const result = await this.surreal.query(query, {
            type: node.type,
            context: node.context,
            namespace: node.namespace,
            metadata: node.metadata || {},
            userState: node.userState,
            author: node.metadata?.author || 'system'
        });

        return result[0]?.result[0]?.id;
    }

    async relateNodes(fromId: string, toId: string, relation: IDRelation): Promise<void> {
        // Basic validation
        if (!fromId || !toId || !relation.type) {
            throw new Error('Invalid relation parameters');
        }

        const query = `
            RELATE ${this.nodesTable}:${fromId}->${relation.type}->${this.nodesTable}:${toId}
            SET 
                metadata = $metadata,
                strength = $strength,
                created_at = time::now(),
                updated_at = time::now();
        `;

        await this.surreal.query(query, {
            metadata: relation.metadata || {},
            strength: relation.strength || 1.0
        });

        // If bidirectional, create reverse relation
        if (relation.bidirectional) {
            const reverseQuery = `
                RELATE ${this.nodesTable}:${toId}->${relation.type}->${this.nodesTable}:${fromId}
                SET 
                    metadata = $metadata,
                    strength = $strength,
                    created_at = time::now(),
                    updated_at = time::now();
            `;

            await this.surreal.query(reverseQuery, {
                metadata: relation.metadata || {},
                strength: relation.strength || 1.0
            });
        }
    }

    async getRelatedNodes(id: string, type?: string, direction: 'in' | 'out' = 'out', depth: number = 1): Promise<{ nodes: IDNode[]; edges: IDRelation[] }> {
        const typeFilter = type ? `WHERE type = '${type}'` : '';
        const traversalOp = direction === 'out' ? '->' : '<-';
        
        const query = `
            SELECT 
                ${traversalOp}(${this.relationsTable}${typeFilter})${traversalOp}${this.nodesTable}[0..${depth}].* as nodes,
                ${traversalOp}(${this.relationsTable}${typeFilter})[0..${depth}].* as edges
            FROM ${this.nodesTable}:${id}
            FETCH nodes, edges;

            -- Update analytics
            UPDATE ${this.relationsTable} 
            SET 
                analytics.access_count += 1,
                analytics.last_accessed = time::now()
            WHERE 
                (in = ${this.nodesTable}:${id} OR out = ${this.nodesTable}:${id})
                ${type ? `AND type = '${type}'` : ''};
        `;

        const result = await this.surreal.query(query);
        return {
            nodes: result[0]?.result[0]?.nodes || [],
            edges: result[0]?.result[0]?.edges || []
        };
    }

    async getAllRelations(id: string): Promise<Record<string, IDNode[]>> {
        const query = `
            LET $outbound = (
                SELECT 
                    type,
                    ->>(contains, references, depends_on, interacts_with)->nodes.* as nodes,
                    ->(contains, references, depends_on, interacts_with).* as edges
                FROM ${this.nodesTable}:${id}
                GROUP BY type
                FETCH nodes, edges
            );
            
            LET $inbound = (
                SELECT 
                    type,
                    <<-(contains, references, depends_on, interacts_with)<-nodes.* as nodes,
                    <-(contains, references, depends_on, interacts_with).* as edges
                FROM ${this.nodesTable}:${id}
                GROUP BY type
                FETCH nodes, edges
            );
            
            RETURN {
                outbound: $outbound,
                inbound: $inbound
            };
        `;

        const result = await this.surreal.query(query);
        return result[0]?.result || { outbound: [], inbound: [] };
    }

    async predictRelatedNodes(id: string): Promise<IDNode[]> {
        // This query finds nodes that are frequently related to nodes similar to the current one
        const query = `
            LET $current = ${this.statesTable}:${id};
            LET $similar = (
                SELECT * FROM ${this.statesTable} 
                WHERE type = $current.type 
                AND namespace = $current.namespace
            );
            LET $related = (
                SELECT * FROM $similar->*
                GROUP BY out
                ORDER BY count() DESC
                LIMIT 5
            );
            RETURN $related;
        `;

        const result = await this.surreal.query(query);
        return result[0].result;
    }

    async batchCreateRelations(relations: Array<{from: string, to: string, relation: IDRelation}>): Promise<void> {
        const queries = relations.map(({from, to, relation}) => `
            RELATE ${this.statesTable}:${from}->${relation.type}->${this.statesTable}:${to}
            SET metadata = $${from}_${to}_metadata;
        `).join('\n');

        const params = relations.reduce((acc, {from, to, relation}) => ({
            ...acc,
            [`${from}_${to}_metadata`]: relation.metadata || {}
        }), {});

        await this.surreal.query(queries, params);
    }

    // Live subscription methods with versioning and error handling
    async subscribeLiveNode(id: string, callback: LiveUpdateCallback): Promise<() => void> {
        try {
            const query = `
                LIVE SELECT *, 
                    history[*].version as versions,
                    history[*].changes as changes,
                    history[*].timestamp as timestamps
                FROM ${this.nodesTable}:${id}
                FETCH versions, changes, timestamps;
            `;
            
            const subscription = await this.surreal.live(query, async (update: any) => {
                try {
                    if (update.action === 'UPDATE') {
                        // Record version history
                        await this.surreal.query(`
                            UPDATE ${this.nodesTable}:${id} MERGE {
                                history: array::append(history, {
                                    version: array::len(history) + 1,
                                    timestamp: time::now(),
                                    changes: $changes,
                                    author: $author
                                })
                            };
                        `, {
                            changes: update.result,
                            author: update.result?.metadata?.author || 'system'
                        });
                    }
                    callback(update);
                } catch (error) {
                    console.error(`Error in live node callback for ${id}:`, error);
                }
            });

            const unsubscribe = () => {
                try {
                    subscription.kill();
                    this.liveSubscriptions.delete(id);
                } catch (error) {
                    console.error(`Error unsubscribing from live node ${id}:`, error);
                }
            };

            this.liveSubscriptions.set(id, {
                unsubscribe,
                retryCount: 0
            });

            return unsubscribe;
        } catch (error) {
            console.error(`Error setting up live subscription for node ${id}:`, error);
            await this.handleLiveQueryError(id, error as Error);
            throw error;
        }
    }

    async subscribeLiveRelations(id: string, callback: LiveUpdateCallback): Promise<() => void> {
        try {
            const query = `
                LIVE SELECT *,
                    history[*].version as versions,
                    history[*].changes as changes,
                    history[*].timestamp as timestamps
                FROM ${this.relationsTable}
                WHERE in = ${this.nodesTable}:${id} OR out = ${this.nodesTable}:${id}
                FETCH versions, changes, timestamps;
            `;
            
            const subscription = await this.surreal.live(query, async (update: any) => {
                try {
                    if (update.action === 'UPDATE' || update.action === 'CREATE') {
                        // Update analytics and version history
                        await this.surreal.query(`
                            UPDATE ${this.relationsTable}:${update.result.id} MERGE {
                                analytics: {
                                    access_count: COALESCE(analytics.access_count, 0) + 1,
                                    last_accessed: time::now(),
                                    version_count: array::len(history)
                                },
                                history: array::append(history, {
                                    version: array::len(history) + 1,
                                    timestamp: time::now(),
                                    changes: $changes,
                                    author: $author
                                })
                            };
                        `, {
                            changes: update.result,
                            author: update.result?.metadata?.author || 'system'
                        });
                    }
                    callback(update);
                } catch (error) {
                    console.error(`Error in live relations callback for ${id}:`, error);
                }
            });

            const unsubscribe = () => {
                try {
                    subscription.kill();
                    this.liveSubscriptions.delete(`rel_${id}`);
                } catch (error) {
                    console.error(`Error unsubscribing from live relations ${id}:`, error);
                }
            };

            this.liveSubscriptions.set(`rel_${id}`, {
                unsubscribe,
                retryCount: 0
            });

            return unsubscribe;
        } catch (error) {
            console.error(`Error setting up live relations subscription for ${id}:`, error);
            await this.handleLiveQueryError(`rel_${id}`, error as Error);
            throw error;
        }
    }

    async subscribeLiveChildren(id: string, callback: LiveUpdateCallback): Promise<() => void> {
        try {
            const query = `
                LIVE SELECT *,
                    ->contains->nodes.* as children,
                    ->contains.* as edges
                FROM ${this.nodesTable}:${id}
                FETCH children, edges;
            `;
            
            const subscription = await this.surreal.live(query, async (update: any) => {
                try {
                    callback(update);
                } catch (error) {
                    console.error(`Error in live children callback for ${id}:`, error);
                }
            });

            const unsubscribe = () => {
                try {
                    subscription.kill();
                    this.liveSubscriptions.delete(`${id}_children`);
                } catch (error) {
                    console.error(`Error unsubscribing from live children ${id}:`, error);
                }
            };

            this.liveSubscriptions.set(`${id}_children`, {
                unsubscribe,
                retryCount: 0
            });

            return unsubscribe;
        } catch (error) {
            console.error(`Error setting up live children subscription for ${id}:`, error);
            await this.handleLiveQueryError(`${id}_children`, error as Error);
            throw error;
        }
    }

    async subscribeLiveType(type: string, callback: LiveUpdateCallback): Promise<() => void> {
        try {
            const query = `
                LIVE SELECT *,
                    history[*].version as versions,
                    history[*].changes as changes,
                    history[*].timestamp as timestamps
                FROM ${this.nodesTable}
                WHERE type = $type
                FETCH versions, changes, timestamps;
            `;
            
            const subscription = await this.surreal.live(query, async (update: any) => {
                try {
                    callback(update);
                } catch (error) {
                    console.error(`Error in live type callback for ${type}:`, error);
                }
            });

            const unsubscribe = () => {
                try {
                    subscription.kill();
                    this.liveSubscriptions.delete(`type_${type}`);
                } catch (error) {
                    console.error(`Error unsubscribing from live type ${type}:`, error);
                }
            };

            this.liveSubscriptions.set(`type_${type}`, {
                unsubscribe,
                retryCount: 0
            });

            return unsubscribe;
        } catch (error) {
            console.error(`Error setting up live type subscription for ${type}:`, error);
            await this.handleLiveQueryError(`type_${type}`, error as Error);
            throw error;
        }
    }

    async unsubscribe(id: string): Promise<void> {
        const subscription = this.liveSubscriptions.get(id);
        if (subscription) {
            try {
                await subscription.unsubscribe();
            } catch (error) {
                console.error(`Error unsubscribing from ${id}:`, error);
            } finally {
                this.liveSubscriptions.delete(id);
            }
        }
    }

    async unsubscribeAll(): Promise<void> {
        const unsubscribePromises = Array.from(this.liveSubscriptions.entries()).map(
            async ([id, subscription]) => {
                try {
                    await subscription.unsubscribe();
                } catch (error) {
                    console.error(`Error unsubscribing from ${id}:`, error);
                }
            }
        );

        await Promise.allSettled(unsubscribePromises);
        this.liveSubscriptions.clear();
    }

    // Reference management methods
    async createSharedRef(type: string, category: string, content: any, metadata: any = {}, isTemplate: boolean = false): Promise<string> {
        const query = `
            CREATE shared_refs SET
                type = $type,
                category = $category,
                content = $content,
                metadata = $metadata,
                is_template = $isTemplate,
                created_at = time::now(),
                updated_at = time::now()
            RETURN id;
        `;

        const result = await this.surreal.query(query, {
            type,
            category,
            content,
            metadata,
            isTemplate
        });

        return result[0]?.result[0]?.id;
    }

    async updateSharedRef(id: string, content: any, metadata: any = {}): Promise<void> {
        const query = `
            UPDATE shared_refs:${id} SET
                content = $content,
                metadata = $metadata,
                template_version = template_version + 1,
                updated_at = time::now();
        `;

        await this.surreal.query(query, { content, metadata });
    }

    async cloneSharedRefsToUser(userId: string, types: string[] = []): Promise<void> {
        const typeFilter = types.length > 0 ? `WHERE type INSIDE $types AND` : 'WHERE';
        const query = `
            LET $templates = (SELECT * FROM shared_refs ${typeFilter} is_template = true);
            
            -- Clone each template to user_refs
            FOR $template IN $templates {
                CREATE user_refs SET
                    user_id = $userId,
                    type = $template.type,
                    category = $template.category,
                    content = $template.content,
                    metadata = $template.metadata,
                    source_template = $template.id,
                    template_version = $template.template_version,
                    created_at = time::now(),
                    updated_at = time::now();
            };
        `;

        await this.surreal.query(query, { userId, types });
    }

    async updateUserRefs(userId: string): Promise<void> {
        const query = `
            -- Find all user refs that need updating
            LET $updates = (SELECT * FROM user_refs
                WHERE user_id = $userId
                AND template_version < source_template.template_version);
            
            -- Update each reference
            FOR $ref IN $updates {
                UPDATE user_refs:$ref.id SET
                    content = $ref.source_template.content,
                    metadata = { 
                        ...metadata,
                        ...{ updated_from_template: time::now() }
                    },
                    template_version = $ref.source_template.template_version;
            };
        `;

        await this.surreal.query(query, { userId });
    }

    async getUserRefs(userId: string, type?: string): Promise<any[]> {
        const typeFilter = type ? 'AND type = $type' : '';
        const query = `
            SELECT *,
                source_template.* as template
            FROM user_refs
            WHERE user_id = $userId ${typeFilter}
            FETCH template;
        `;

        const result = await this.surreal.query(query, { userId, type });
        return result[0]?.result || [];
    }

    async customizeUserRef(userId: string, refId: string, customContent: any, customMetadata: any = {}): Promise<void> {
        const query = `
            UPDATE user_refs:${refId} SET
                content = $content,
                metadata = {
                    ...metadata,
                    ...{ customized: true },
                    ...{ customized_at: time::now() },
                    ...$customMetadata
                },
                updated_at = time::now()
            WHERE user_id = $userId;
        `;

        await this.surreal.query(query, {
            userId,
            content: customContent,
            customMetadata
        });
    }
}
