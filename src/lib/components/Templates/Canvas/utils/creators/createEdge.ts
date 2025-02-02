import type { Edge, Anchor, EdgeKey } from '../../types/logic';
import type { WritableEdge, EdgeConfig, EdgeStyle, EndStyle, EdgeLabel } from '$lib/components/Organisms/Edge/Edge.types';
import * as s from '../../constants/styles';
import { sortEdgeKey } from '../helpers/sortKey';

export function createEdge(
	connection: { source: Anchor; target: Anchor },
	edge: Edge | null,
	config?: EdgeConfig
): WritableEdge {
	const { source, target } = connection;
	const edgeId = (source.id && target.id ? sortEdgeKey(source.id, target.id) : `E-cursor-${Date.now()}`) as EdgeKey;

	const writableEdge: WritableEdge = {
		id: edgeId,
		source: connection.source,
		target: connection.target,
		component: null,
		type: config?.style ?? null,
		color: config?.color ?? null,
		width: config?.width ?? 0,
		animated: false,
		rendered: { value: false, set: (value) => { writableEdge.rendered.value = value; } },
		start: config?.start ?? 'none',
		end: config?.end ?? 'none',
		metadata: config?.metadata ?? {
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

	if (config?.label) {
		writableEdge.label = {
			text: config.label.text,
			color: config.label.color ?? s.EDGE_LABEL_COLOR,
			textColor: config.label.textColor ?? s.EDGE_LABEL_TEXT_COLOR,
			position: config.label.position
		};
	}

	return writableEdge;
}
