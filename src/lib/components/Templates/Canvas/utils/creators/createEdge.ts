import type { WritableEdge, EdgeConfig, Anchor, Edge } from '../../types';
import * as s from '../../constants/styles';
import type { EdgeLabel, EdgeKey } from '../../types';
import { sortEdgeKey } from '../helpers/sortKey';

export function createEdge(
	connection: { source: Anchor; target: Anchor },
	edge: Edge | null,
	config?: EdgeConfig
): WritableEdge {
	const { source, target } = connection;
	const edgeId: EdgeKey = source.id && target.id ? sortEdgeKey(source.id, target.id) : 'cursor';

	const writableEdge: WritableEdge = {
		id: edgeId,
		target: connection.target,
		source: connection.source,
		component: edge,
		type: config?.type || null,
		color: config?.color || null,
		width: config?.width || 0,
		animated: config?.animated || false,
		rendered: false,
		start: config?.start || null,
		end: config?.end || null,
		metadata: config?.metadata || {
			status: 'active',
			flowRate: 1,
			healthScore: 1,
			input: {
				id: 'default-input',
				type: 'default',
				validation: { required: true }
			},
			output: {
				id: 'default-output',
				type: 'default'
			}
		}
	};
	// if (config?.raiseEdges) writableEdge.raiseEdgeOnSelect = true;
	// if (config?.edgesAbove) writableEdge.edgesAbove = true;
	if (config?.disconnect) writableEdge.disconnect = true;
	if (config?.label) {
		const baseLabel: EdgeLabel = {
			text: config.label.text,
			color: config.label?.color || s.EDGE_LABEL_COLOR,
			textColor: config.label?.textColor || s.EDGE_LABEL_TEXT_COLOR,
			fontSize: config.label?.fontSize || s.EDGE_LABEL_FONT_SIZE,
			dimensions: {
				width: config.label.dimensions?.width || s.EDGE_LABEL_WIDTH,
				height: config.label.dimensions?.height || s.EDGE_LABEL_HEIGHT
			},
			borderRadius: config.label.borderRadius || s.EDGE_LABEL_BORDER_RADIUS
		};
		writableEdge.label = baseLabel;
	}

	return writableEdge;
}
