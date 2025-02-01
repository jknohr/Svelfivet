import { getTouchDistance } from '$lib/components/Templates/Canvas/utils/helpers';
import type { XYPair } from '$lib/components/Templates/Canvas/types';

// State declarations using runes
let cursorPosition = $state<XYPair>({ x: 0, y: 0 });
let initialClickPosition = $state<XYPair>({ x: 0, y: 0 });
let tracking = $state(false);
let touchDistance = $state(0);
let resizing = $state(false);

// Derived state
let isMoving = $derived(tracking && touchDistance === 0);
let isTouching = $derived(touchDistance > 0);

// Event handlers
function setupCursorTracking() {
	const updateCursorPosition = (e: MouseEvent) => {
		cursorPosition = { x: e.clientX, y: e.clientY };
	};

	const updateTouchPosition = (e: TouchEvent) => {
		if (e.touches.length === 2) {
			touchDistance = getTouchDistance(e.touches[0], e.touches[1]);
			cursorPosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
		} else if (e.touches.length === 1) {
			tracking = true;
			cursorPosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
		}
	};

	const onTouchStart = (e: TouchEvent) => {
		updateTouchPosition(e);
		window.addEventListener('touchend', onTouchEnd);
		window.addEventListener('touchmove', updateTouchPosition);
	};

	const onTouchEnd = () => {
		tracking = false;
		touchDistance = 0;
		window.removeEventListener('touchmove', updateTouchPosition);
	};

	// Setup event listeners
	$effect(() => {
		document.addEventListener('mousemove', updateCursorPosition);
		window.addEventListener('touchstart', onTouchStart, true);

		return () => {
			window.removeEventListener('mousemove', updateCursorPosition);
			window.removeEventListener('touchstart', onTouchStart);
			window.removeEventListener('touchmove', updateTouchPosition);
			window.removeEventListener('touchend', onTouchEnd);
		};
	});
}

// Initialize tracking
setupCursorTracking();

// Development mode inspection
// @ts-ignore
if (import.meta?.env?.DEV) {
	$effect.pre(() => {
		$inspect(cursorPosition, 'Cursor Position');
		$inspect(tracking, 'Tracking State');
		$inspect(touchDistance, 'Touch Distance');
	});
}

// Exports
export {
	cursorPosition,
	initialClickPosition,
	tracking,
	touchDistance,
	resizing,
	isMoving,
	isTouching
};
