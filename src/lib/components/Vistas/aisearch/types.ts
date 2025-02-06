export interface SearchResult {
    id: string;
    content: string;
    title: string;
    type: 'document' | 'conversation' | 'code' | 'other';
    score: number;
    metadata: {
        created: string;
        updated: string;
        author?: string;
        tags?: string[];
        category?: string;
    };
}

export interface SearchFilters {
    type?: string[];
    dateRange?: {
        start: string;
        end: string;
    };
    tags?: string[];
    category?: string;
}

export interface SearchHistory {
    id: string;
    query: string;
    timestamp: string;
    userId: string;
    filters?: SearchFilters;
    resultCount: number;
}
