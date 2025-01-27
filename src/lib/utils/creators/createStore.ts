import type { Store } from '$lib/types';

export function createStore<T, K>(): Store<T, K> {
	type TData = Map<K, T>;

	const data = $state(new Map() as TData);

	const store: Store<T, K> = {
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
		add: (item: T, key: K) => {
			data.set(key, item);
			return data;
		},
		get: (key: K) => {
			return data.get(key) || null;
		},
		getAll: () => {
			return Array.from(data.values());
		},
		delete: (key: K) => {
			const deleted = data.delete(key);
			return deleted;
		},
		count: () => data.size
	};

	return store;
}
