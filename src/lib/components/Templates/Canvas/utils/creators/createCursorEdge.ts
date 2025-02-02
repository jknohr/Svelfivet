import type { Anchor, Edge } from '../../types/logic';
import type { EdgeConfig } from '$lib/components/Organisms/Edge/Edge.types';
import { createEdge } from './createEdge';

export function createCursorEdge(source: Anchor, target: Anchor, disconnect?: boolean) {
    const config: EdgeConfig = {
        id: 'cursor',
        source: source.node,
        target: target.node
    };
    return createEdge(
        { source, target },
        source.edge || target.edge || null,
        config
    );
} 