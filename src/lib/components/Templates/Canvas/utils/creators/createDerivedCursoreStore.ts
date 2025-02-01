import type { XYPair, GraphDimensions } from '../../types';
import { calculateRelativeCursor } from '../calculators';

export function createDerivedCursorStore(
	cursorPositionRaw: () => XYPair,
	dimensions: () => GraphDimensions,
	translation: () => XYPair,
	scale: () => number
): XYPair {
	let cursorPosition = $state<XYPair>({ x: 0, y: 0 });

	$effect(() => {
		const rawPos = cursorPositionRaw();
		const dims = dimensions();
		const trans = translation();
		const scaleVal = scale();

		const e = {
			clientX: rawPos.x,
			clientY: rawPos.y
		};

		cursorPosition = calculateRelativeCursor(
			e,
			dims.top,
			dims.left,
			dims.width,
			dims.height,
			scaleVal,
			trans
		);
	});

	return new Proxy({} as XYPair, {
		get(target, prop) {
			if (prop === 'x') return cursorPosition.x;
			if (prop === 'y') return cursorPosition.y;
			return undefined;
		}
	});
}
