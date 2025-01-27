import type { Graph } from '$lib/types';

// Function to traverse a nested object and extract the data
function traverse(obj: Record<string, any>, depth = 0) {
	const output: Record<string, any> = {};
	for (const key in obj) {
		const value = obj[key];

		if (key === 'nodes' && typeof value === 'object' && value.getAll) {
			const nodesArray = value.getAll();
			output[key] = nodesArray.map((node: any) => {
				const nodeData: Record<string, any> = {};
				for (const nodeKey in node) {
					const nodeValue = node[nodeKey];
					if (typeof nodeValue === 'object' && nodeValue !== null) {
						nodeData[nodeKey] = traverse(nodeValue, depth + 1);
					} else {
						nodeData[nodeKey] = nodeValue;
					}
				}
				return nodeData;
			});
		} else if (typeof value === 'object' && value !== null) {
			output[key] = traverse(value, depth + 1);
		} else {
			output[key] = value;
		}
	}
	return output;
}

// Custom replacer function for JSON.stringify()
function domRectReplacer(_key: string, value: any) {
	if (value instanceof DOMRectReadOnly) {
		return {
			x: value.x,
			y: value.y,
			width: value.width,
			height: value.height
		};
	}
	return value;
}

// Function to get JSON stringified data from nested state
export function getJSONState(store: any) {
	const data = traverse(store);
	const raw = JSON.stringify(data, domRectReplacer);
	localStorage.setItem('state', raw);
	return raw;
}
