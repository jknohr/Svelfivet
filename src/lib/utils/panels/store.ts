import type { PanelConfig, PanelPosition, PanelState } from './types';

// Panel store to manage active panels
let activePanels = $state<Record<PanelPosition, PanelState[]>>({
    left: [],
    right: []
});

// Cache for loaded components
const componentCache = new Map<string, any>();

// Load a component dynamically
async function loadComponent(path: string) {
    if (componentCache.has(path)) {
        return componentCache.get(path);
    }

    try {
        const module = await import(`../../${path}`);
        const component = module.default;
        componentCache.set(path, component);
        return component;
    } catch (error) {
        console.error(`Failed to load panel component: ${path}`, error);
        return null;
    }
}

// Show a panel
export async function showPanel(config: PanelConfig) {
    const component = await loadComponent(config.component);
    if (!component) return;

    const panelState: PanelState = {
        id: config.id,
        isVisible: true,
        position: config.position,
        component,
        props: config.props || {},
        metadata: config.metadata
    };

    // Add panel to the correct position array
    const positionPanels = activePanels[config.position];
    const existingIndex = positionPanels.findIndex(p => p.id === config.id);

    if (existingIndex >= 0) {
        // Update existing panel
        positionPanels[existingIndex] = panelState;
    } else {
        // Add new panel
        positionPanels.push(panelState);
        // Sort by order if metadata.order is present
        positionPanels.sort((a, b) => 
            (a.metadata?.order || 0) - (b.metadata?.order || 0)
        );
    }
}

// Hide a panel
export function hidePanel(id: string) {
    for (const position of ['left', 'right'] as PanelPosition[]) {
        const index = activePanels[position].findIndex(p => p.id === id);
        if (index >= 0) {
            activePanels[position].splice(index, 1);
            break;
        }
    }
}

// Hide all panels
export function hideAllPanels() {
    activePanels.left = [];
    activePanels.right = [];
}

// Get active panels for a position
export function getPanels(position: PanelPosition): PanelState[] {
    return activePanels[position];
}

// Check if a panel is visible
export function isPanelVisible(id: string): boolean {
    return Object.values(activePanels).some(
        panels => panels.some(p => p.id === id && p.isVisible)
    );
}

// Update panel props
export function updatePanelProps(id: string, props: Record<string, any>) {
    for (const position of ['left', 'right'] as PanelPosition[]) {
        const panel = activePanels[position].find(p => p.id === id);
        if (panel) {
            panel.props = { ...panel.props, ...props };
            break;
        }
    }
}
