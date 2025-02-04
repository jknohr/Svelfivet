// Automatic ID mapping and relationship management

import type { IDNode, IDRelation } from './id-relations';
import { getRelationManager } from './id-state';

export type NavigationType = 'child' | 'parent' | 'reference' | 'dependency' | 'sibling';

export interface ElementNavigation {
    type: NavigationType;
    targetId: string;
    metadata: Record<string, any>;
    position?: number;
}

export interface ElementMapping {
    elementId: string;
    snippetId?: string;
    parentId?: string;
    children: string[];
    type: 'element' | 'snippet';
    metadata: Record<string, any>;
    navigation?: ElementNavigation[];
}

export class IDMapper {
    private static instance: IDMapper;
    private relationManager = getRelationManager();
    private mappingCache = $state(new Map<string, ElementMapping>());
    private observer: MutationObserver;

    private constructor() {
        // Initialize DOM observer
        this.observer = new MutationObserver(this.handleDOMChanges.bind(this));
        this.startObserving();
    }

    static getInstance(): IDMapper {
        if (!IDMapper.instance) {
            IDMapper.instance = new IDMapper();
        }
        return IDMapper.instance;
    }

    private startObserving() {
        this.observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['id', 'data-snippet-type']
        });
    }

    private async handleDOMChanges(mutations: MutationRecord[]) {
        for (const mutation of mutations) {
            if (mutation.type === 'childList') {
                // Handle added nodes
                for (const node of Array.from(mutation.addedNodes)) {
                    if (node instanceof HTMLElement) {
                        await this.processElement(node);
                    }
                }
                // Handle removed nodes
                for (const node of Array.from(mutation.removedNodes)) {
                    if (node instanceof HTMLElement) {
                        await this.handleRemovedElement(node);
                    }
                }
            } else if (mutation.type === 'attributes') {
                // Handle attribute changes
                const element = mutation.target as HTMLElement;
                await this.processElement(element);
            }
        }
    }

    private async processElement(element: HTMLElement) {
        const elementId = element.id;
        if (!elementId || !elementId.startsWith('neural-')) return;

        // Get navigation information
        const navigation = await this.buildNavigationInfo(element);

        const snippetType = element.getAttribute('data-snippet-type');
        const parentElement = element.parentElement;
        const parentId = parentElement?.id;
        const children = Array.from(element.children)
            .filter(child => child instanceof HTMLElement && child.id)
            .map(child => (child as HTMLElement).id);

        const mapping: ElementMapping = {
            elementId,
            snippetId: snippetType ? elementId : undefined,
            parentId: parentId?.startsWith('neural-') ? parentId : undefined,
            children: children.filter(id => id.startsWith('neural-')),
            type: snippetType ? 'snippet' : 'element',
            metadata: {
                snippetType,
                className: element.className,
                attributes: this.getRelevantAttributes(element)
            },
            navigation
        };

        // Update mapping cache
        this.mappingCache.set(elementId, mapping);

        // Update relationships in database
        await this.updateRelationships(mapping);
    }

    private getRelevantAttributes(element: HTMLElement): Record<string, string> {
        const relevantAttrs = ['data-snippet-type', 'class', 'style'];
        const attrs: Record<string, string> = {};
        
        for (const attr of relevantAttrs) {
            const value = element.getAttribute(attr);
            if (value) attrs[attr] = value;
        }
        
        return attrs;
    }

    private async buildNavigationInfo(element: HTMLElement): Promise<ElementNavigation[]> {
        const navigation: ElementNavigation[] = [];
        const elementId = element.id;

        // Get siblings
        const parent = element.parentElement;
        if (parent) {
            const siblings = Array.from(parent.children)
                .filter(child => child instanceof HTMLElement && child.id && child.id !== elementId)
                .map((child, index) => ({
                    type: 'sibling' as NavigationType,
                    targetId: (child as HTMLElement).id,
                    metadata: { position: index },
                    position: index
                }));
            navigation.push(...siblings);
        }

        // Get references from data attributes
        const refAttr = element.getAttribute('data-references');
        if (refAttr) {
            const refs = refAttr.split(',').map(ref => ({
                type: 'reference' as NavigationType,
                targetId: ref.trim(),
                metadata: { type: 'explicit' }
            }));
            navigation.push(...refs);
        }

        // Get dependencies from data attributes
        const depAttr = element.getAttribute('data-depends-on');
        if (depAttr) {
            const deps = depAttr.split(',').map(dep => ({
                type: 'dependency' as NavigationType,
                targetId: dep.trim(),
                metadata: { type: 'explicit' }
            }));
            navigation.push(...deps);
        }

        return navigation;
    }

    private async updateRelationships(mapping: ElementMapping) {
        if (!this.relationManager) return;

        // Create or update the node
        const node: IDNode = {
            id: mapping.elementId,
            type: mapping.type,
            context: 'ui',
            namespace: 'neural',
            metadata: mapping.metadata
        };

        try {
            // Create node relationship
            await this.relationManager.createNode(node);

            // Update parent relationship
            if (mapping.parentId) {
                const parentRelation: IDRelation = {
                    type: 'contains',
                    metadata: { position: Array.from(mapping.parentId).indexOf(mapping.elementId) }
                };
                await this.relationManager.relateNodes(mapping.parentId, mapping.elementId, parentRelation);
            }

            // Update snippet relationship if applicable
            if (mapping.snippetId) {
                const snippetRelation: IDRelation = {
                    type: 'references',
                    metadata: { snippetType: mapping.metadata.snippetType }
                };
                await this.relationManager.relateNodes(mapping.elementId, mapping.snippetId, snippetRelation);
            }

            // Update children relationships
            for (const childId of mapping.children) {
                const childRelation: IDRelation = {
                    type: 'contains',
                    metadata: { position: mapping.children.indexOf(childId) }
                };
                await this.relationManager.relateNodes(mapping.elementId, childId, childRelation);
            }

        } catch (error) {
            console.error('Error updating relationships:', error);
        }
    }

    private async handleRemovedElement(element: HTMLElement) {
        const elementId = element.id;
        if (!elementId || !elementId.startsWith('neural-')) return;

        // Remove from cache
        this.mappingCache.delete(elementId);

        // Mark as inactive in database
        if (this.relationManager) {
            try {
                // Instead of deleting, we mark it as inactive
                await this.relationManager.createNode({
                    id: elementId,
                    type: 'inactive',
                    context: 'ui',
                    namespace: 'neural',
                    metadata: { removedAt: new Date().toISOString() }
                });
            } catch (error) {
                console.error('Error handling removed element:', error);
            }
        }
    }

    // Public methods for manual control if needed
    async forceUpdateElement(elementId: string) {
        const element = document.getElementById(elementId);
        if (element) {
            await this.processElement(element);
        }
    }

    async getElementMapping(elementId: string): Promise<ElementMapping | undefined> {
        return this.mappingCache.get(elementId);
    }

    async getRelatedElements(elementId: string, relationType: NavigationType): Promise<IDNode[]> {
        if (!this.relationManager) return [];
        return this.relationManager.getRelatedNodes(elementId, relationType);
    }

    // Cleanup
    destroy() {
        this.observer.disconnect();
    }
}
