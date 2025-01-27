import type { Graph, XYPair } from '$lib/types';
import { calculateRelativeCursor } from '../calculators';

export function createDerivedCursorStore(
	cursorPositionRaw: () => { x: number; y: number },
	dimensions: () => Graph['dimensions'],
	translation: () => Graph['transforms']['translation'],
	scale: () => number
): { x: number; y: number } {
	let cursorPosition = $state({ x: 0, y: 0 });

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

	return new Proxy({} as { x: number; y: number }, {
		get(target, prop) {
			if (prop === 'x') return cursorPosition.x;
			if (prop === 'y') return cursorPosition.y;
			return undefined;
		}
	});
}
