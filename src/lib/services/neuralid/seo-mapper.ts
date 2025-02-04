// Automatic SEO mapping and context building
import type { IDNode } from './id-relations';
import { getRelationManager } from './id-state';
import { IDMapper, type ElementMapping } from './id-mapper';

export interface SEOContext {
    title?: string;
    description?: string;
    keywords?: string[];
    type: string;
    importance: number;
    relations: SEORelation[];
    metadata: Record<string, any>;
}

export interface SEORelation {
    type: 'parent' | 'child' | 'related' | 'reference';
    targetId: string;
    context: string;
    weight: number;
}

export class SEOMapper {
    private static instance: SEOMapper;
    private relationManager = getRelationManager();
    private idMapper = IDMapper.getInstance();
    private seoCache = $state(new Map<string, SEOContext>());
    
    private constructor() {
        this.setupMutationObserver();
    }

    static getInstance(): SEOMapper {
        if (!SEOMapper.instance) {
            SEOMapper.instance = new SEOMapper();
        }
        return SEOMapper.instance;
    }

    private setupMutationObserver() {
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'attributes' || mutation.type === 'childList') {
                    const element = mutation.target as HTMLElement;
                    if (element.id?.startsWith('neural-')) {
                        this.processElement(element);
                    }
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['data-seo', 'data-seo-type', 'data-seo-importance']
        });
    }

    private async processElement(element: HTMLElement) {
        const elementId = element.id;
        if (!elementId) return;

        // Extract SEO data from element
        const seoData = element.getAttribute('data-seo');
        const seoType = element.getAttribute('data-seo-type') || 'content';
        const seoImportance = parseInt(element.getAttribute('data-seo-importance') || '1', 10);

        // Parse SEO JSON data if available
        let seoMetadata: Record<string, any> = {};
        if (seoData) {
            try {
                seoMetadata = JSON.parse(seoData);
            } catch (e) {
                console.warn('Invalid SEO data format:', e);
            }
        }

        // Build SEO context
        const context: SEOContext = {
            title: this.extractTitle(element),
            description: this.extractDescription(element),
            keywords: this.extractKeywords(element),
            type: seoType,
            importance: seoImportance,
            relations: await this.buildSEORelations(element),
            metadata: {
                ...seoMetadata,
                content: this.extractContent(element),
                path: this.buildContentPath(element),
                structure: this.analyzeStructure(element)
            }
        };

        // Update cache
        this.seoCache.set(elementId, context);

        // Update database
        await this.updateSEOContext(elementId, context);
    }

    private extractTitle(element: HTMLElement): string | undefined {
        // Try explicit SEO title
        const seoTitle = element.getAttribute('data-seo-title');
        if (seoTitle) return seoTitle;

        // Try heading elements
        const heading = element.querySelector('h1, h2, h3, h4, h5, h6');
        if (heading) return heading.textContent?.trim();

        // Try aria-label
        const ariaLabel = element.getAttribute('aria-label');
        if (ariaLabel) return ariaLabel;

        return undefined;
    }

    private extractDescription(element: HTMLElement): string | undefined {
        // Try explicit SEO description
        const seoDesc = element.getAttribute('data-seo-description');
        if (seoDesc) return seoDesc;

        // Try meta description
        const metaDesc = element.getAttribute('data-meta-description');
        if (metaDesc) return metaDesc;

        // Generate from content
        const content = this.extractContent(element);
        if (content) {
            return content.split('.')[0]?.trim(); // First sentence
        }

        return undefined;
    }

    private extractKeywords(element: HTMLElement): string[] {
        const keywords: string[] = [];

        // Explicit keywords
        const seoKeywords = element.getAttribute('data-seo-keywords');
        if (seoKeywords) {
            keywords.push(...seoKeywords.split(',').map(k => k.trim()));
        }

        // Extract from content
        const content = this.extractContent(element);
        if (content) {
            // Add important phrases (e.g., text in strong/em tags)
            element.querySelectorAll('strong, em, mark').forEach(el => {
                if (el.textContent) keywords.push(el.textContent.trim());
            });
        }

        return [...new Set(keywords)]; // Remove duplicates
    }

    private extractContent(element: HTMLElement): string {
        // Get text content, excluding script and style elements
        return Array.from(element.childNodes)
            .filter(node => {
                const parent = node.parentElement;
                return parent && 
                       !['SCRIPT', 'STYLE'].includes(parent.tagName) &&
                       !parent.getAttribute('data-seo-ignore');
            })
            .map(node => node.textContent)
            .join(' ')
            .trim();
    }

    private buildContentPath(element: HTMLElement): string[] {
        const path: string[] = [];
        let current: HTMLElement | null = element;

        while (current && current !== document.body) {
            const seoType = current.getAttribute('data-seo-type');
            if (seoType) {
                path.unshift(seoType);
            }
            current = current.parentElement;
        }

        return path;
    }

    private analyzeStructure(element: HTMLElement): Record<string, any> {
        return {
            depth: this.getElementDepth(element),
            childCount: element.children.length,
            hasMedia: element.querySelector('img, video, audio') !== null,
            hasLinks: element.querySelector('a') !== null,
            isInteractive: element.querySelector('button, input, select, textarea') !== null
        };
    }

    private getElementDepth(element: HTMLElement): number {
        let depth = 0;
        let current = element;
        while (current && current !== document.body) {
            depth++;
            current = current.parentElement as HTMLElement;
        }
        return depth;
    }

    private async buildSEORelations(element: HTMLElement): Promise<SEORelation[]> {
        const relations: SEORelation[] = [];
        const elementId = element.id;

        // Get element mapping from IDMapper
        const mapping = await this.idMapper.getElementMapping(elementId);
        if (!mapping) return relations;

        // Add parent relation
        if (mapping.parentId) {
            relations.push({
                type: 'parent',
                targetId: mapping.parentId,
                context: 'structural',
                weight: 1.0
            });
        }

        // Add child relations
        for (const childId of mapping.children) {
            relations.push({
                type: 'child',
                targetId: childId,
                context: 'structural',
                weight: 0.8
            });
        }

        // Add navigation-based relations
        if (mapping.navigation) {
            for (const nav of mapping.navigation) {
                relations.push({
                    type: 'related',
                    targetId: nav.targetId,
                    context: nav.type,
                    weight: nav.type === 'reference' ? 0.9 : 0.7
                });
            }
        }

        return relations;
    }

    private async updateSEOContext(elementId: string, context: SEOContext) {
        if (!this.relationManager) return;

        try {
            // Create/update node with SEO context
            await this.relationManager.createNode({
                id: elementId,
                type: 'seo',
                context: 'seo',
                namespace: 'neural',
                metadata: {
                    ...context,
                    updatedAt: new Date().toISOString()
                }
            });

            // Update relations
            for (const relation of context.relations) {
                await this.relationManager.relateNodes(
                    elementId,
                    relation.targetId,
                    {
                        type: 'seo',
                        metadata: {
                            context: relation.context,
                            weight: relation.weight
                        }
                    }
                );
            }
        } catch (error) {
            console.error('Error updating SEO context:', error);
        }
    }

    // Public methods
    async getSEOContext(elementId: string): Promise<SEOContext | undefined> {
        return this.seoCache.get(elementId);
    }

    async getRelatedContent(elementId: string): Promise<Array<{ id: string; context: SEOContext; relevance: number }>> {
        const context = await this.getSEOContext(elementId);
        if (!context) return [];

        const related: Array<{ id: string; context: SEOContext; relevance: number }> = [];

        for (const relation of context.relations) {
            const relatedContext = await this.getSEOContext(relation.targetId);
            if (relatedContext) {
                related.push({
                    id: relation.targetId,
                    context: relatedContext,
                    relevance: relation.weight
                });
            }
        }

        return related.sort((a, b) => b.relevance - a.relevance);
    }

    async buildSiteMap(): Promise<Record<string, SEOContext>> {
        const siteMap: Record<string, SEOContext> = {};
        
        for (const [id, context] of this.seoCache.entries()) {
            siteMap[id] = context;
        }

        return siteMap;
    }
}
