export interface FilterSettings {
    id: string;
    user: string;
    vista: string;
    filters: Array<{
        id: string;
        label: string;
        type: 'select' | 'range' | 'checkbox' | 'text';
        field: string;
        options?: any[];
    }>;
}

export interface Property {
    id: string;
    title: string;
    description: string;
    price: number;
    location: {
        address: string;
        city: string;
        state: string;
        zip: string;
        coordinates?: {
            lat: number;
            lng: number;
        };
    };
    features: string[];
    images: string[];
    status: 'available' | 'pending' | 'sold';
    createdAt: string;
    updatedAt: string;
}
