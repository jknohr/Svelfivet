import type { Anchor, EdgeConfig, Edge } from '../../types';
import { createEdge } from './createEdge';

export function createCursorEdge(source: Anchor, target: Anchor, disconnect?: boolean) {
    const config: EdgeConfig = { disconnect: true };
    return createEdge(
        { source, target },
        source.edge || target.edge || null,
        config
    );
} 