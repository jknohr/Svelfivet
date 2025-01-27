import { getTouchDistance } from '$lib/utils/helpers';
import type { XYPair } from '$lib/types';
import { writable } from 'svelte/store';

// State
const initialClickPosition = writable<XYPair>({ x: 0, y: 0 });
let tracking = $state(false);
let touchDistance = $state(0);
let resizing = $state(false);
let cursorPosition = $state<XYPair>({ x: 0, y: 0 });

// Update functions
function setInitialClickPosition(position: XYPair) {
	initialClickPosition = position;
}

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

	document.addEventListener('mousemove', updateCursorPosition);
	window.addEventListener('touchstart', onTouchStart, true);

	return () => {
		window.removeEventListener('mousemove', updateCursorPosition);
		window.removeEventListener('touchstart', onTouchStart);
		window.removeEventListener('touchmove', updateTouchPosition);
		window.removeEventListener('touchend', onTouchEnd);
	};
}

// Setup tracking
setupCursorTracking();

export { initialClickPosition, tracking, touchDistance, resizing, cursorPosition, setInitialClickPosition };
