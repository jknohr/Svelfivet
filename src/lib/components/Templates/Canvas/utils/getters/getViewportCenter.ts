import { calculateViewportCenter } from '../calculators';
import { dimensions, translation, scale } from '../../stores/ViewportStore';
import type { XYPair } from '../../types/logic';

export function getViewportCenter(graphId: string): XYPair {
	const extendedDimensions = {
		...dimensions,
		top: 0,  // Since we're using viewport coordinates, top and left are 0
		left: 0
	};

	return calculateViewportCenter(
		extendedDimensions,
		translation,
		scale
	);
}
