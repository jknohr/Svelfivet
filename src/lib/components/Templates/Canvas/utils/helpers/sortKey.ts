import type { AnchorKey, EdgeKey } from '../../types';

export function sortEdgeKey(source: AnchorKey, target: AnchorKey): EdgeKey {
    const [first, second] = [source, target].sort();
    return `E-${first}+${second}` as EdgeKey;
} 