import type { Graph } from '$lib/types';
import { calculateZoom, calculateTranslation } from '../calculators';

export function zoomAndTranslate(
	direction = 1,
	dimensions: Graph['dimensions'],
	transforms: Graph['transforms'],
	increment = 0.1
) {
	const { width, height, top, left } = dimensions;

	const scale = transforms.scale;
	const graphTranslation = transforms.translation;

	const newScale = calculateZoom(scale, direction, increment);
	const newTranslation = calculateTranslation(
		scale,
		newScale,
		graphTranslation,
		{ x: width / 2 + left, y: height / 2 + top },
		dimensions
	);

	transforms.scale = newScale;
	transforms.translation = newTranslation;
}
