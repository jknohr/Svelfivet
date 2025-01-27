import type { WrappedWritable } from '$lib/types';
import type { CSSColorString } from '$lib/types';

export function generateOutput<
	T extends Record<string, number | string | object | boolean | CSSColorString>,
	R extends number | string | object | boolean | CSSColorString
>(inputs: WrappedWritable<T>, processor: (inputs: T) => R) {
	const state = $state({ value: null as R | null });

	const updateOutputValue = () => {
		const currentInputs = {} as T;
		for (const key in inputs) {
			let value: T[keyof T];
			inputs[key].subscribe((v) => (value = v))();
			currentInputs[key as keyof T] = value!;
		}
		state.value = processor(currentInputs);
	};

	// Initial calculation
	updateOutputValue();

	// Subscribe to all input changes
	const unsubscribeFns: (() => void)[] = [];
	for (const key in inputs) {
		unsubscribeFns.push(
			inputs[key].subscribe(() => {
				updateOutputValue();
			})
		);
	}

	return {
		subscribe: (subscriber: (value: R | null) => void) => {
			subscriber(state.value);
			return () => {};
		},
		unsubscribe: () => {
			unsubscribeFns.forEach((fn) => fn());
		},
		set: null,
		update: null
	};
}
