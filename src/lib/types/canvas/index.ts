import type { Writable } from 'svelte/store';

export interface Graph {
    cursor: {
        x: number;
        y: number;
    };
    // Add other graph properties as needed
}

export interface Node {
    rotation: number;
    // Add other node properties as needed
}

export type CustomWritable<T> = Writable<T>;

export type CSSColorString = string;
export type RGBString = `rgb(${number}, ${number}, ${number})`;
export type HSLString = `hsl(${number}, ${number}%, ${number}%)`;

export type isArrow = boolean;
