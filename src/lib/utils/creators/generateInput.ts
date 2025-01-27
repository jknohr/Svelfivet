import type { WrappedWritable } from '$lib/types';

export function generateInput<T extends Record<string, number | string | boolean | object>>(
	initialData: T
): WrappedWritable<T> {
	const newStore: Partial<WrappedWritable<T>> = {};
	for (const key in initialData) {
		const state = $state({ value: initialData[key as keyof T] });
		newStore[key as keyof T] = {
			subscribe: (subscriber: (value: T[keyof T]) => void) => {
				subscriber(state.value);
				return () => {};
			},
			set: (newValue: T[keyof T]) => {
				state.value = newValue;
			},
			update: (updater: (value: T[keyof T]) => T[keyof T]) => {
				state.value = updater(state.value);
			}
		};
	}
	return newStore as WrappedWritable<T>;
}
