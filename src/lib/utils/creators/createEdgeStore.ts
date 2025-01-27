import type { Anchor, Node, WritableEdge, EdgeStore, CustomEdgeKey } from '$lib/types';

export function createEdgeStore(): EdgeStore {
	type TData = Map<CustomEdgeKey, WritableEdge>;

	// Initialize state with runes
	const data = $state(new Map() as TData);
	const subscribersOnChange = $state(new Set<
		(edge: WritableEdge, type: 'connection' | 'disconnection') => void
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
		add: (item: WritableEdge, key: CustomEdgeKey) => {
			if (typeof key !== 'string' && key instanceof Set) {
				const elements = Array.from(key);
				const anchor1 = elements[0] as Anchor;
				const anchor2 = elements[1] as Anchor;
				anchor1.connected.add(anchor2);
				anchor2.connected.add(anchor1);
				if (store.match(...elements).length) return;

				subscribersOnChange.forEach((subscriber) => subscriber(item, 'connection'));
			}

			data.set(key, item);
		},
		getAll: () => {
			return Array.from(data.values());
		},
		get: (key: CustomEdgeKey) => {
			return data.get(key) || null;
		},
		match: (...args: Array<Node | Anchor | null>) => {
			return Array.from(data.keys()).filter((key) => {
				if (key === 'cursor') return false;
				if (!(key instanceof Set)) return false;
				return args.every((arg) => {
					if (!arg) return true;
					return key.has(arg);
				});
			});
		},
		fetch: (source: Anchor, target: Anchor) => {
			const match = Array.from(data.keys()).filter((key) => {
				if (key === 'cursor') return false;
				if (!(key instanceof Set)) return false;
				return [source, target].every((arg) => {
					if (!arg) return true;
					return key.has(arg);
				});
			})[0];
			return data.get(match) || null;
		},
		delete: (key: CustomEdgeKey) => {
			if (typeof key !== 'string' && key instanceof Set) {
				const elements = Array.from(key);
				const anchor1 = elements[0] as Anchor;
				const anchor2 = elements[1] as Anchor;
				anchor1.connected.delete(anchor2);
				anchor2.connected.delete(anchor1);
			}
			let deleted = false;
			const edge = data.get(key);
			if (!edge) return false;
			data.delete(key);
			deleted = true;
			if (typeof key !== 'string')
				subscribersOnChange.forEach((subscriber) => subscriber(edge, 'disconnection'));
			return deleted;
		},
		onEdgeChange: (
			subscriber: (edge: WritableEdge, type: 'connection' | 'disconnection') => void
		) => {
			subscribersOnChange.add(subscriber);
			return () => subscribersOnChange.delete(subscriber);
		},
		count: () => data.size
	};

	return store;
}
