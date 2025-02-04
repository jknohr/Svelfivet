// lib/services/neuralid/IDElement.ts
import { useIDContext } from './id-context';
import { generateElementID } from './neuralID';
import { registerID, updateIDState, deactivateID, getIDState, relateIDs, getRelatedIDs, predictRelatedIDs, getRelationManager } from './id-state';
import { IDMapper, type NavigationType } from './id-mapper';
import { SEOMapper, type SEOContext } from './seo-mapper';
import type { IDNode, IDRelation, LiveUpdateCallback } from './id-relations';

export class IDElement {
    private idContext = useIDContext();
    private type: string;
    private _elementId: string;
    private _liveState = $state<IDNode | null>(null);
    private _seoContext = $state<SEOContext | null>(null);
    private _liveChildren = $state<IDNode[]>([]);
    private _liveRelations = $state<{
        outbound: IDNode[];
        inbound: IDNode[];
        navigation: Map<NavigationType, IDNode[]>;
    }>({ 
        outbound: [], 
        inbound: [], 
        navigation: new Map()
    });
    
    constructor(type: string, metadata: Record<string, any> = {}) {
        this.type = type;
        this._elementId = generateElementID({
            ...this.idContext,
            elementType: this.type
        });
        
        // Register the element in state management
        this.initialize(metadata);
    }

    private async initialize(metadata: Record<string, any>) {
        // Initialize SEO context
        const seoMapper = SEOMapper.getInstance();
        const seoContext = await seoMapper.getSEOContext(this._elementId);
        if (seoContext) {
            this._seoContext = seoContext;
        }
        await registerID(this._elementId, this.type, {
            ...metadata,
            context: this.idContext
        });

        // Setup live subscriptions
        this.setupLiveSubscriptions();

        // Register with mapper
        const mapper = IDMapper.getInstance();
        await mapper.forceUpdateElement(this._elementId);
    }

    private setupLiveSubscriptions() {
        const relationManager = getRelationManager();
        if (!relationManager) return;

        // Subscribe to node changes
        relationManager.subscribeLiveNode(this._elementId, (data) => {
            this._liveState = data;
        });

        // Subscribe to children changes
        relationManager.subscribeLiveChildren(this._elementId, (data) => {
            this._liveChildren = data;
        });

        // Subscribe to all relations
        relationManager.subscribeLiveRelations(this._elementId, (data) => {
            this._liveRelations = data;
        });
    }

    get elementId(): string {
        return this._elementId;
    }

    get state() {
        return this._liveState || getIDState(this._elementId);
    }

    get liveChildren() {
        return this._liveChildren;
    }

    get liveRelations() {
        return this._liveRelations;
    }

    async updateMetadata(metadata: Record<string, any>) {
        await updateIDState(this._elementId, {
            metadata: {
                ...this.state?.metadata,
                ...metadata
            }
        });
    }

    async deactivate() {
        const relationManager = getRelationManager();
        if (relationManager) {
            relationManager.unsubscribe(this._elementId);
            relationManager.unsubscribe(`${this._elementId}_children`);
            relationManager.unsubscribe(`${this._elementId}_relations`);
        }
        await deactivateID(this._elementId);
    }

    // Relationship methods
    async relateTo(targetId: string, relation: IDRelation) {
        await relateIDs(this._elementId, targetId, relation);
    }

    async getRelated(relation: string, direction: 'in' | 'out' = 'out'): Promise<IDNode[]> {
        return getRelatedIDs(this._elementId, relation, direction);
    }

    async predictRelated(): Promise<IDNode[]> {
        return predictRelatedIDs(this._elementId);
    }

    // SEO methods
    async getSEOContext(): Promise<SEOContext | null> {
        return this._seoContext;
    }

    async getRelatedContent(): Promise<Array<{ id: string; context: SEOContext; relevance: number }>> {
        const seoMapper = SEOMapper.getInstance();
        return seoMapper.getRelatedContent(this._elementId);
    }

    // Navigation methods
    async navigateTo(type: NavigationType): Promise<IDNode[]> {
        const mapper = IDMapper.getInstance();
        return mapper.getRelatedElements(this._elementId, type);
    }

    async getNavigationPaths(): Promise<NavigationType[]> {
        const mapper = IDMapper.getInstance();
        const mapping = await mapper.getElementMapping(this._elementId);
        return mapping?.navigation?.map(n => n.type) || [];
    }

    // Helper methods for common relationships
    async addChild(childId: string, metadata: Record<string, any> = {}) {
        await this.relateTo(childId, {
            type: 'contains',
            metadata
        });
    }

    async addReference(refId: string, metadata: Record<string, any> = {}) {
        await this.relateTo(refId, {
            type: 'references',
            metadata
        });
    }

    async addDependency(depId: string, metadata: Record<string, any> = {}) {
        await this.relateTo(depId, {
            type: 'depends_on',
            metadata
        });
    }

    // Live subscription methods
    onStateChange(callback: LiveUpdateCallback): () => void {
        const relationManager = getRelationManager();
        return relationManager?.subscribeLiveNode(this._elementId, callback) || (() => {});
    }

    onChildrenChange(callback: LiveUpdateCallback): () => void {
        const relationManager = getRelationManager();
        return relationManager?.subscribeLiveChildren(this._elementId, callback) || (() => {});
    }

    onRelationsChange(callback: LiveUpdateCallback): () => void {
        const relationManager = getRelationManager();
        return relationManager?.subscribeLiveRelations(this._elementId, callback) || (() => {});
    }

    // Getters that use live data when available
    async getChildren(): Promise<IDNode[]> {
        return this._liveChildren.length > 0 ? this._liveChildren : this.getRelated('contains', 'out');
    }

    async getParents(): Promise<IDNode[]> {
        return this._liveRelations.inbound.length > 0 ? 
            this._liveRelations.inbound.filter(node => node.type === 'contains') : 
            this.getRelated('contains', 'in');
    }

    async getReferences(): Promise<IDNode[]> {
        return this._liveRelations.outbound.length > 0 ? 
            this._liveRelations.outbound.filter(node => node.type === 'references') : 
            this.getRelated('references', 'out');
    }

    async getDependencies(): Promise<IDNode[]> {
        return this._liveRelations.outbound.length > 0 ? 
            this._liveRelations.outbound.filter(node => node.type === 'depends_on') : 
            this.getRelated('depends_on', 'out');
    }
}
