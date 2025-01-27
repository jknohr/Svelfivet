export type UnwrapWritable<T> = T;

export interface CustomWritable<T> {
	subscribe: (subscriber: (value: T) => void) => () => void;
	set: ((value: T) => void) | null;
	update: ((fn: (value: T) => T) => void) | null;
}

export type WrappedWritable<T> = {
	[K in keyof T]: CustomWritable<T[K]>;
};

export type ActiveIntervals = Record<string, ReturnType<typeof setInterval> | undefined>;
