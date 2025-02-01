import type { XYPair } from '$lib/components/Templates/Canvas/types';

export * from './calculators';
export * from './creators';
export * from './adders/populateStore';
export * from './helpers';
export * from './movers';

export function updateTranslation(
    initialPosition: XYPair,
    currentPosition: XYPair,
    transforms: any
): XYPair {
    const dx = currentPosition.x - initialPosition.x;
    const dy = currentPosition.y - initialPosition.y;
    
    return {
        x: transforms.translation.x + dx,
        y: transforms.translation.y + dy
    };
}
