import { calculateViewportCenter } from '../calculators/calculateViewPortCenter';
import { graphStore } from '$lib/stores';

export function getViewportCenter(graphId: string) {
	const graph = graphStore.get(`G-${graphId}`);
	if (!graph) throw new Error(`Graph with id ${graphId} not found`);

	return calculateViewportCenter(
		graph.dimensions,
		graph.transforms.translation,
		graph.transforms.scale
	);
}
