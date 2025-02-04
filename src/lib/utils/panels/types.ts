export type PanelPosition = 'left' | 'right';

export interface PanelConfig {
    id: string;
    component: string;  // Path to the component relative to src/lib
    position: PanelPosition;
    props?: Record<string, any>;
    metadata?: {
        width?: string;
        title?: string;
        icon?: string;
        persistent?: boolean;
        order?: number;
    };
}

export interface PanelState {
    id: string;
    isVisible: boolean;
    position: PanelPosition;
    component: any;  // Loaded component
    props: Record<string, any>;
    metadata?: PanelConfig['metadata'];
}
