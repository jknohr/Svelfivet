// User state management for Neural ID system

export interface DeviceInfo {
    deviceId: string;
    deviceType: 'desktop' | 'mobile' | 'vr' | 'tablet' | 'other';
    lastSynced: string;
    capabilities?: {
        input: string[];
        display: string[];
        features: string[];
    };
}

export interface StateSync {
    stateId: string;
    deviceId: string;
    timestamp: string;
    syncStatus: 'pending' | 'complete' | 'failed';
    retryCount?: number;
}

export interface UserState {
    id: string;
    userId: string;
    context: string;
    namespace: string;
    stateType: 'preference' | 'ui' | 'session' | 'custom';
    data: Record<string, any>;
    deviceStates: Record<string, {
        data: Record<string, any>;
        lastUpdated: string;
        deviceInfo: DeviceInfo;
    }>;
    sharedState: {
        data: Record<string, any>;
        lastUpdated: string;
    };
    metadata?: {
        lastUpdated: string;
        version?: number;
        tags?: string[];
        activeDevice?: string;
        syncHistory?: StateSync[];
    };
}

export interface UserStateQuery {
    userId?: string;
    context?: string;
    namespace?: string;
    stateType?: string;
    tags?: string[];
}

export class UserStateManager {
    private deviceId: string;
    private deviceType: 'desktop' | 'mobile' | 'vr' | 'tablet' | 'other';
    private syncInterval: number = 5000; // 5 seconds default
    private syncTimer?: NodeJS.Timer;

    private detectDeviceType(): 'desktop' | 'mobile' | 'vr' | 'tablet' | 'other' {
        // Implement device detection logic
        // For now returning desktop as default
        return 'desktop';
    }

    private getDeviceCapabilities(): DeviceInfo['capabilities'] {
        // Implement capability detection
        return {
            input: ['keyboard', 'mouse'],
            display: ['2d'],
            features: ['standard']
        };
    }
    private static instance: UserStateManager;
    private surreal: any;
    
    private constructor(surreal: any) {
        this.surreal = surreal;
        this.deviceId = crypto.randomUUID();
        this.deviceType = this.detectDeviceType();
        this.startStateSync();
    }

    static getInstance(surreal: any): UserStateManager {
        if (!UserStateManager.instance) {
            UserStateManager.instance = new UserStateManager(surreal);
        }
        return UserStateManager.instance;
    }

    private get statesTable() {
        return 'NeuralUserStates';
    }

    private startStateSync() {
        this.syncTimer = setInterval(async () => {
            await this.syncStates();
        }, this.syncInterval);
    }

    private async syncStates() {
        const query = `
            SELECT * FROM ${this.statesTable}
            WHERE metadata.activeDevice != $deviceId
            AND array::contains(metadata.syncHistory, function($x) {
                return $x.deviceId == $deviceId AND $x.syncStatus == 'pending'
            });
        `;

        const pendingStates = await this.surreal.query(query, { deviceId: this.deviceId });
        
        for (const state of pendingStates[0].result) {
            await this.mergeDeviceState(state.id);
        }
    }

    private async mergeDeviceState(stateId: string) {
        const state = await this.getUserState(stateId);
        if (!state) return;

        const currentDeviceState = state.deviceStates[this.deviceId];
        const activeDeviceState = state.deviceStates[state.metadata?.activeDevice || ''];

        if (currentDeviceState && activeDeviceState) {
            // Merge states based on timestamp
            if (new Date(activeDeviceState.lastUpdated) > new Date(currentDeviceState.lastUpdated)) {
                await this.updateDeviceState(stateId, activeDeviceState.data);
            }
        }

        // Update sync status
        await this.updateSyncStatus(stateId, 'complete');
    }

    async createUserState(state: Omit<UserState, 'id'>): Promise<UserState> {
        const id = crypto.randomUUID();
        const timestamp = new Date().toISOString();
        
        const query = `
            CREATE ${this.statesTable}:${id} 
            SET 
                userId = $userId,
                context = $context,
                namespace = $namespace,
                stateType = $stateType,
                deviceStates = {
                    $deviceId: {
                        data: $data,
                        lastUpdated: $timestamp,
                        deviceInfo: $deviceInfo
                    }
                },
                sharedState = {
                    data: $data,
                    lastUpdated: $timestamp
                },
                metadata = {
                    lastUpdated: $timestamp,
                    version: 1,
                    tags: $tags,
                    activeDevice: $deviceId,
                    syncHistory: [{
                        stateId: $id,
                        deviceId: $deviceId,
                        timestamp: $timestamp,
                        syncStatus: 'complete'
                    }]
                };
        `;
        
        await this.surreal.query(query, {
            userId: state.userId,
            context: state.context,
            namespace: state.namespace,
            stateType: state.stateType,
            deviceId: this.deviceId,
            data: state.data,
            timestamp,
            tags: state.metadata?.tags || [],
            deviceInfo: {
                deviceId: this.deviceId,
                deviceType: this.deviceType,
                lastSynced: timestamp,
                capabilities: this.getDeviceCapabilities()
            },
            id
        });

        return {
            id,
            ...state,
            metadata: {
                lastUpdated: timestamp,
                version: 1,
                tags: state.metadata?.tags || []
            }
        };
    }

    async updateDeviceState(id: string, data: Record<string, any>): Promise<void> {
        const timestamp = new Date().toISOString();
        
        const query = `
            UPDATE ${this.statesTable}:${id} 
            MERGE deviceStates[$deviceId] = {
                data: $data,
                lastUpdated: $timestamp,
                deviceInfo: $deviceInfo
            }
            SET 
                metadata.lastUpdated = $timestamp,
                metadata.version += 1,
                metadata.activeDevice = $deviceId,
                metadata.syncHistory += {
                    stateId: $id,
                    deviceId: $deviceId,
                    timestamp: $timestamp,
                    syncStatus: 'pending'
                }
            RETURN AFTER;
        `;

        await this.surreal.query(query, {
            deviceId: this.deviceId,
            data,
            timestamp,
            deviceInfo: {
                deviceId: this.deviceId,
                deviceType: this.deviceType,
                lastSynced: timestamp,
                capabilities: this.getDeviceCapabilities()
            },
            id
        });
    }

    async updateSharedState(id: string, data: Record<string, any>): Promise<void> {
        const timestamp = new Date().toISOString();
        
        const query = `
            UPDATE ${this.statesTable}:${id} 
            SET 
                sharedState = {
                    data: $data,
                    lastUpdated: $timestamp
                },
                metadata.lastUpdated = $timestamp,
                metadata.version += 1
            RETURN AFTER;
        `;
        
        const result = await this.surreal.query(query, {
            data: data.data,
            timestamp
        });

        return result[0].result[0];
    }

    async updateSyncStatus(id: string, status: StateSync['syncStatus']): Promise<void> {
        const timestamp = new Date().toISOString();
        
        const query = `
            UPDATE ${this.statesTable}:${id} 
            SET metadata.syncHistory[-1].syncStatus = $status,
                metadata.syncHistory[-1].timestamp = $timestamp
            WHERE metadata.syncHistory[-1].deviceId == $deviceId;
        `;

        await this.surreal.query(query, {
            status,
            timestamp,
            deviceId: this.deviceId
        });
    }

    async getUserState(id: string): Promise<UserState | null> {
        const query = `
            SELECT *,
                   deviceStates[$deviceId] as currentDeviceState
            FROM ${this.statesTable}:${id};`;
        const result = await this.surreal.query(query);
        return result[0].result[0] || null;
    }

    async queryUserStates(query: UserStateQuery): Promise<UserState[]> {
        let conditions = [];
        const params: Record<string, any> = {};

        if (query.userId) {
            conditions.push('userId = $userId');
            params.userId = query.userId;
        }
        if (query.context) {
            conditions.push('context = $context');
            params.context = query.context;
        }
        if (query.namespace) {
            conditions.push('namespace = $namespace');
            params.namespace = query.namespace;
        }
        if (query.stateType) {
            conditions.push('stateType = $stateType');
            params.stateType = query.stateType;
        }
        if (query.tags && query.tags.length > 0) {
            conditions.push('$tags CONTAINSANY metadata.tags');
            params.tags = query.tags;
        }

        const whereClause = conditions.length > 0 
            ? 'WHERE ' + conditions.join(' AND ')
            : '';

        const queryStr = `
            SELECT * 
            FROM ${this.statesTable}
            ${whereClause}
            ORDER BY metadata.lastUpdated DESC;
        `;

        const result = await this.surreal.query(queryStr, params);
        return result[0].result;
    }

    async deleteUserState(id: string): Promise<void> {
        const query = `DELETE ${this.statesTable}:${id};`;
        await this.surreal.query(query);
    }

    // Subscribe to live updates for a specific user's states
    subscribeLiveUserStates(userId: string, callback: (states: UserState[]) => void): () => void {
        const query = `LIVE SELECT * FROM ${this.statesTable} WHERE userId = $userId;`;
        const unsubscribe = this.surreal.live(query, { userId }, callback);
        return unsubscribe;
    }
}
