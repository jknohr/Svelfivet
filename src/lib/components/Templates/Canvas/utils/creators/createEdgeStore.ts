import type { Edge, EdgeKey, Anchor, Node, EdgeStore } from '$lib/components/Templates/Canvas/types';
import type { WritableEdge } from '$lib/components/Organisms/Edge/Edge.types';

export function createEdgeStore(): EdgeStore {
	type TData = Map<`E-${string}`, Edge>;

	// Initialize state with runes
	const data = $state(new Map() as TData);
	const subscribersOnChange = $state(new Set<
		(edge: Edge, type: 'connection' | 'disconnection') => void
	>());

	const store = {
		subscribe: (subscriber: (value: TData) => void) => {
			subscriber(data);
			return () => {};
		},
		set: (value: TData) => {
			data.clear();
			value.forEach((v, k) => data.set(k, v));
		},
		update: (updater: (value: TData) => TData) => {
			const newValue = updater(data);
			data.clear();
			newValue.forEach((v, k) => data.set(k, v));
		},
		add: (item: Edge, key: `E-${string}`) => {
			const isSetKey = typeof key === 'object' && key !== null && 'has' in key && 'add' in key;
			if (isSetKey) {
				const elements = Array.from(key as unknown as Set<Anchor>);
				const anchor1 = elements[0];
				const anchor2 = elements[1];
				anchor1.connected.add(anchor2);
				anchor2.connected.add(anchor1);
				if (store.match(...elements).length) return data;

				subscribersOnChange.forEach((subscriber) => subscriber(item, 'connection'));
			}

			data.set(key, item);
			return data;
		},
		getAll: () => {
			return Array.from(data.values());
		},
		get: (key: `E-${string}`) => {
			return data.get(key) || null;
		},
		match: (...args: Array<Node | Anchor | null>) => {
			return Array.from(data.keys()).filter((key) => {
				if (!key.startsWith('E-')) return false;
				const isSetKey = typeof key === 'object' && key !== null && 'has' in key;
				if (!isSetKey) return false;
				return args.every((arg) => {
					if (!arg) return true;
					return (key as unknown as Set<Node | Anchor>).has(arg);
				});
			});
		},
		fetch: (source: Anchor, target: Anchor) => {
			const match = Array.from(data.keys()).filter((key) => {
				if (!key.startsWith('E-')) return false;
				const isSetKey = typeof key === 'object' && key !== null && 'has' in key;
				if (!isSetKey) return false;
				return [source, target].every((arg) => {
					if (!arg) return true;
					return (key as unknown as Set<Node | Anchor>).has(arg);
				});
			})[0];
			return data.get(match) || null;
		},
		delete: (key: `E-${string}`) => {
			const isSetKey = typeof key === 'object' && key !== null && 'has' in key;
			if (isSetKey) {
				const elements = Array.from(key as unknown as Set<Anchor>);
				const anchor1 = elements[0];
				const anchor2 = elements[1];
				anchor1.connected.delete(anchor2);
				anchor2.connected.delete(anchor1);
			}
			let deleted = false;
			const edge = data.get(key);
			if (!edge) return false;
			data.delete(key);
			deleted = true;
			if (isSetKey)
				subscribersOnChange.forEach((subscriber) => subscriber(edge, 'disconnection'));
			return deleted;
		},
		onEdgeChange: (
			subscriber: (edge: Edge, type: 'connection' | 'disconnection') => void
		) => {
			subscribersOnChange.add(subscriber);
			return () => subscribersOnChange.delete(subscriber);
		},
		count: () => data.size
	};

	return store;
}
