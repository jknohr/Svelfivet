import type { Node, Graph } from '$lib/components/Templates/Canvas/types';

export function populateStore(nodes: Node[], graph: Graph) {
	for (const node of nodes) {
		graph.nodes.add(node, node.id);
	}
}
