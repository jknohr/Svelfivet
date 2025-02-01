import type { Graph, XYPair } from '../../types/logic';
import { calculateZoom, calculateTranslation } from '../calculators';

interface GraphDimensions {
	width: number;
	height: number;
	top: number;
	left: number;
}

export function zoomAndTranslate(
	direction = 1,
	dimensions: GraphDimensions,
	transforms: { scale: number; translation: XYPair },
	increment = 0.1
) {
	const { width, height, top, left } = dimensions;

	const scale = transforms.scale;
	const graphTranslation = transforms.translation;

	const newScale = calculateZoom(scale, direction);
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
