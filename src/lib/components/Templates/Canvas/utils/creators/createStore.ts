import type { Store } from '../../types';
import type { ReactiveMapState, NodeStore, AnchorStore } from '../../types/stores';
import type { Node, NodeKey, XYPair, Dimensions, Anchor, AnchorKey } from '../../types/logic';

/**
 * Creates a reactive state container using Svelte 5 runes
 * Only use this when you absolutely need store-like behavior that runes can't provide
 */
export function createStore<K extends string, V>(initialItems?: Map<K, V>): Store<V, K> & ReactiveMapState<K, V> & (V extends Node ? NodeStore : V extends Anchor ? AnchorStore : unknown) {
	const items = $state(initialItems ?? new Map<K, V>());

	const store = {
		items,
		get size() { return items.size; },
		subscribe: (subscriber: (value: Map<K, V>) => void) => {
			subscriber(items);
			return () => {};
		},
		set: (value: Map<K, V>) => {
			items.clear();
			value.forEach((v, k) => items.set(k, v));
		},
		update: (updater: (value: Map<K, V>) => Map<K, V>) => {
			const newValue = updater(items);
			items.clear();
			newValue.forEach((v, k) => items.set(k, v));
		},
		add: (item: V, key: K) => {
			items.set(key, item);
			return items;
		},
		get: (key: K) => {
			return items.get(key) ?? null;
		},
		getAll: () => {
			return Array.from(items.values());
		},
		delete: (key: K) => {
			return items.delete(key);
		},
		count: () => items.size,
		// ReactiveMapState methods
		setItem(key: K, value: V) {
			items.set(key, value);
		},
		deleteItem(key: K) {
			items.delete(key);
		},
		getItem(key: K) {
			return items.get(key);
		},
		getAllItems() {
			return Array.from(items.values());
		},
		clearItems() {
			items.clear();
		}
	};

	// Add NodeStore methods if V is Node
	const firstItem = store.getAllItems()[0];
	const isNode = firstItem && typeof firstItem === 'object' && firstItem !== null && 'position' in firstItem && 'dimensions' in firstItem;

	if (isNode) {
		Object.assign(store, {
			add(key: NodeKey, value: Node) {
				items.set(key as K, value as unknown as V);
			},
			remove(key: NodeKey) {
				items.delete(key as K);
			},
			get(key: NodeKey) {
				return items.get(key as K) as Node | undefined;
			},
			getAll() {
				return Array.from(items.values()) as Node[];
			},
			clear() {
				items.clear();
			},
			updatePosition(key: NodeKey, position: XYPair) {
				const node = items.get(key as K) as Node | undefined;
				if (node) {
					node.position = position;
				}
			},
			updateDimensions(key: NodeKey, dimensions: Dimensions) {
				const node = items.get(key as K) as Node | undefined;
				if (node) {
					node.dimensions = dimensions;
				}
			}
		});
	}

	// Add AnchorStore methods if V is Anchor
	const isAnchor = firstItem && typeof firstItem === 'object' && firstItem !== null && 'type' in firstItem && ('input' in firstItem || 'output' in firstItem);

	if (isAnchor) {
		Object.assign(store, {
			add(key: AnchorKey, value: Anchor) {
				items.set(key as K, value as unknown as V);
			},
			remove(key: AnchorKey) {
				items.delete(key as K);
			},
			get(key: AnchorKey) {
				return items.get(key as K) as Anchor | undefined;
			},
			getAll() {
				return Array.from(items.values()) as Anchor[];
			},
			clear() {
				items.clear();
			}
		});
	}

	return store as Store<V, K> & ReactiveMapState<K, V> & (V extends Node ? NodeStore : V extends Anchor ? AnchorStore : unknown);
}
