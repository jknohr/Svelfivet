import type { ReactiveMapState } from '../../types/store';

/**
 * Creates a reactive state container using Svelte 5 runes
 * Only use this when you absolutely need store-like behavior that runes can't provide
 */
export function createStore<K extends string, V>(initialItems?: Map<K, V>): ReactiveMapState<K, V> {
	const items = $state(initialItems ?? new Map<K, V>());

	return {
		items,
		get size() { return items.size; }
	};
}
