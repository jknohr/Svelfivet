import type { VectorPlusPosition } from './calculateStepPath';
import type { XYPair } from '$lib/types';

export * from './calculateFitContent';
export * from './calculateTranslation';
export * from './calculateZoom';
export * from './calculateRelativeCursor';
export * from './updateTranslation';
export * from './calculateStepPath';
export * from './calculateFitView';
export * from './calculateRadius';
export * from './calculatePath';

export function calculateSubwayPath(source: VectorPlusPosition, target: VectorPlusPosition, radius: number): string {
    const dx = target.x - source.x;
    const dy = target.y - source.y;
    const midX = source.x + dx / 2;
    const midY = source.y + dy / 2;
    
    return `M ${source.x},${source.y} 
            L ${midX},${source.y} 
            A ${radius} ${radius} 0 0 1 ${midX},${midY}
            L ${midX},${target.y} 
            L ${target.x},${target.y}`;
}

export function calculateHorizontalPath(source: VectorPlusPosition, target: VectorPlusPosition, radius: number): string {
    return `M ${source.x},${source.y} 
            L ${target.x},${source.y} 
            L ${target.x},${target.y}`;
}

export function calculateVerticalPath(source: VectorPlusPosition, target: VectorPlusPosition, radius: number): string {
    return `M ${source.x},${source.y} 
            L ${source.x},${target.y} 
            L ${target.x},${target.y}`;
}

export function calculateDagrePath(source: VectorPlusPosition, target: VectorPlusPosition, radius: number): string {
    // For now, use a simple S-curve. In a real implementation, this would use dagre for layout
    return `M ${source.x},${source.y} 
            S ${source.x},${target.y} ${target.x},${target.y}`;
}

export function calculateTokyoPath(source: VectorPlusPosition, target: VectorPlusPosition, radius: number): string {
    const dx = target.x - source.x;
    const dy = target.y - source.y;
    
    // Calculate midpoints for 45-degree routing
    const midX = source.x + dx / 2;
    const midY = source.y + dy / 2;

    // Determine if we should route via diagonal lines
    const shouldUseDiagonal = Math.abs(dx) > radius * 2 && Math.abs(dy) > radius * 2;

    if (shouldUseDiagonal) {
        // Calculate diagonal points
        const diagonal = Math.min(Math.abs(dx), Math.abs(dy)) * 0.5;
        const signX = Math.sign(dx);
        const signY = Math.sign(dy);
        
        const x1 = source.x + diagonal * signX;
        const y1 = source.y + diagonal * signY;
        const x2 = target.x - diagonal * signX;
        const y2 = target.y - diagonal * signY;

        return `M ${source.x},${source.y}
                L ${x1},${y1}
                L ${x2},${y2}
                L ${target.x},${target.y}`;
    } else {
        // Use a single 45-degree turn
        if (Math.abs(dx) > Math.abs(dy)) {
            const turnX = midX - Math.sign(dx) * Math.abs(dy) / 2;
            return `M ${source.x},${source.y}
                    L ${turnX},${source.y}
                    L ${target.x},${target.y}`;
        } else {
            const turnY = midY - Math.sign(dy) * Math.abs(dx) / 2;
            return `M ${source.x},${source.y}
                    L ${source.x},${turnY}
                    L ${target.x},${target.y}`;
        }
    }
}
