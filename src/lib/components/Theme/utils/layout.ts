import type { Theme } from '$lib/components/Templates/Canvas/types';

/**
 * Layout utility functions that integrate with the theme system
 */
export function calculateFitContentWidth(
    element: HTMLElement, 
    theme?: Theme
): [number, number] {
    // Get theme scaling factor if available
    const scale = theme?.layout?.scale || 1;
    
    const clone = element.cloneNode(true) as HTMLElement;
    clone.style.position = 'absolute';
    clone.style.visibility = 'hidden';
    clone.style.width = 'auto';
    clone.style.height = 'auto';
    document.body.appendChild(clone);

    // Account for theme scaling in measurements
    const width = clone.offsetWidth * scale;
    const height = clone.offsetHeight * scale;

    document.body.removeChild(clone);
    return [width, height];
} 