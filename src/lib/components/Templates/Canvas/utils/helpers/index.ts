import type {
	XYPair,
	Node,
	Edge,
	AnchorKey,
	EdgeKey,
	NodeProps,
	EdgeProps,
	Direction
} from '../../types/logic';

import type { CSSColorString } from '../../types/theme';

import type { Writable } from 'svelte/store';
import { writable } from 'svelte/store';

// Type definitions
type Shape = 'round' | 'square' | 'stadium' | 'subroutine' | 'cylindrical' | 'circle' | 'rhombus' | 'hexagon';
type EdgeShape = 'straight' | 'bezier';
type OpenBracket = '(' | '[' | '{';
type CloseBracket = ')' | '}' | ']';
type ShapeRef = { [key: string]: Shape };
type EdgeRef = { [key: string]: EdgeShape };
type BracketRef = Record<OpenBracket, CloseBracket>;

// FlowChart types
export interface FlowNode {
	id: string;
	data: {
		shape: string;
		content: string;
	};
	type: string;
	children: Array<{
		node: FlowNode;
		style?: string;
		label?: string;
		width?: number;
	}>;
	parents: Array<{
		node: FlowNode;
	}>;
	depth: number;
	nesting: number;
}

export type NodeArray = Array<FlowNode>;

export interface FlowChart {
	parentNodes: NodeArray;
	nodeList: Record<string, FlowNode>;
}

// Constants
const shapeRef: ShapeRef = {
	'(': 'round',
	'[': 'square',
	'([': 'stadium',
	'[[': 'subroutine',
	'[(': 'cylindrical',
	'((': 'circle',
	'{': 'rhombus',
	'{{': 'hexagon'
};

const edgeRef: EdgeRef = { '-': 'straight', '~': 'bezier' };
const bracketRef: BracketRef = { '(': ')', '[': ']', '{': '}' };
const edgeRegex = /[-=~]*>(?:\s*\|(.+?)\|)?/g;

// Update the type definition for ArcKey
type ArcKey = '1001' | '0110' | '100-1' | '0-110' | '-1001' | '01-10' | '-100-1' | '0-1-10';

/**
 * Adds properties from propValues to propObject based on propNames
 */
export function addProps(
	propNames: string[],
	propValues: Record<string, any>,
	propObject: Record<string, any>
): void {
	for (let i = 0; i < propNames.length; i++) {
		if (propValues[propNames[i]] !== undefined) {
			propObject[propNames[i]] = propValues[propNames[i]];
		}
	}
}

/**
 * Builds an arc string key from two vectors
 */
export function buildArcStringKey(a: XYPair, b: XYPair): ArcKey {
	const aX = Math.sign(a.x).toString();
	const aY = Math.sign(a.y).toString();
	const bX = Math.sign(b.x).toString();
	const bY = Math.sign(b.y).toString();
	return `${aX}${aY}${bX}${bY}` as ArcKey;
}

/**
 * Constructs an SVG arc string
 */
export function constructArcString(cornerRadius: number, key: ArcKey): string {
	const arcStrings: Record<string, string> = {
		'1001': `a ${cornerRadius} ${cornerRadius} 0 0 1 ${cornerRadius} ${cornerRadius}`,
		'0110': `a ${cornerRadius} ${cornerRadius} 0 0 0 ${cornerRadius} ${cornerRadius}`,
		'100-1': `a ${cornerRadius} ${cornerRadius} 0 0 0 ${cornerRadius} -${cornerRadius}`,
		'0-110': `a ${cornerRadius} ${cornerRadius} 0 0 1 ${cornerRadius} -${cornerRadius}`,
		'-1001': `a ${cornerRadius} ${cornerRadius} 0 0 0 -${cornerRadius} ${cornerRadius}`,
		'01-10': `a ${cornerRadius} ${cornerRadius} 0 0 1 -${cornerRadius} ${cornerRadius}`,
		'-100-1': `a ${cornerRadius} ${cornerRadius} 0 0 1 -${cornerRadius} -${cornerRadius}`,
		'0-1-10': `a ${cornerRadius} ${cornerRadius} 0 0 0 -${cornerRadius} -${cornerRadius}`
	};
	return arcStrings[key as string] || '';
}

/**
 * Builds a path string
 */
export function buildPath(string: string, xStep: number, yStep: number, arcString: string): string {
	return string + ` l ${xStep} ${yStep} ` + arcString;
}

/**
 * Click outside directive for Svelte
 */
export function clickOutside(node: HTMLElement): { destroy: () => void } {
	const handleClick = (event: Event): void => {
		const target = event.target as EventTarget;
		if (!target || !(target instanceof HTMLElement) || !node.contains(target)) {
			node.dispatchEvent(new CustomEvent('outclick'));
		}
	};

	window.addEventListener('mousedown', handleClick, true);

	return {
		destroy() {
			window.removeEventListener('mousedown', handleClick, true);
		}
	};
}

/**
 * Debounces a function call
 */
export function debounce<T extends unknown[], R>(
	func: (...args: T) => R,
	wait: number
): (...args: T) => void {
	let timeout: ReturnType<typeof setTimeout> | null;
	return (...args: T) => {
		if (timeout) clearTimeout(timeout);
		timeout = setTimeout(() => func(...args), wait);
	};
}

/**
 * Generates a unique key
 */
export function generateKey(): string {
	return Math.random().toString(36).substring(7);
}

/**
 * Generates a random RGB color
 */
export function getRandomColor(): CSSColorString {
	const random255 = () => Math.floor(Math.random() * 256);
	const r = random255();
	const g = random255();
	const b = random255();
	return `rgb(${r},${g},${b})`;
}

/**
 * Calculates the distance between two touch points
 */
export function getTouchDistance(touch1: Touch, touch2: Touch): number {
	const dx = touch1.clientX - touch2.clientX;
	const dy = touch1.clientY - touch2.clientY;
	return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Calculates the midpoint between two touch points
 */
export function getTouchMidpoint(touch1: Touch, touch2: Touch): { clientX: number; clientY: number } {
	return {
		clientX: (touch1.clientX + touch2.clientX) / 2,
		clientY: (touch1.clientY + touch2.clientY) / 2
	};
}

/**
 * Rotates a vector by a given angle (in degrees)
 */
export function rotateVector(vector: XYPair, angle: number): XYPair {
	const angleInRadians = angle * (Math.PI / 180);
	return {
		x: vector.x * Math.cos(angleInRadians) - vector.y * Math.sin(angleInRadians),
		y: vector.x * Math.sin(angleInRadians) + vector.y * Math.cos(angleInRadians)
	};
}

/**
 * Rounds a number to a specified number of decimal places
 */
export function roundNum(number: number, decimalPlaces = 1): number {
	const factor = Math.pow(10, decimalPlaces);
	return Math.round(number * factor) / factor;
}

/**
 * Sorts and combines two anchor keys into an edge key
 */
export function sortEdgeKey(keyOne: AnchorKey, keyTwo: AnchorKey): EdgeKey {
	const sortedStrings = [keyOne, keyTwo].sort();
	return `${sortedStrings[0]}+${sortedStrings[1]}` as EdgeKey;
}

/**
 * Throttles a function call
 */
export function throttle<T extends unknown[], R>(
	func: (...args: T) => R,
	limit: number
): (...args: T) => void {
	let lastCall = 0;
	return (...args: T) => {
		const now = new Date().getTime();
		if (now - lastCall >= limit) {
			lastCall = now;
			func(...args);
		}
	};
}

/**
 * Makes all values in an object writable stores
 */
export function makeObjectValuesWritable<T extends Record<string, unknown>>(
	object: T
): { [K in keyof T]: Writable<T[K]> } {
	const writableObject = {} as { [K in keyof T]: Writable<T[K]> };
	for (const key in object) {
		writableObject[key] = writable(object[key]);
	}
	return writableObject;
}

/**
 * Parses a flowchart from a mermaid string
 */
export const flowChartParser = (mermaid: string): FlowChart => {
	const lines = mermaid.split('\n');
	const flowChart: FlowChart = { parentNodes: [], nodeList: {} };

	for (const line of lines) {
		const { parentNodes, childNodes, edge } = parseLine(line);
		for (const parentNode of parentNodes) {
			if (!flowChart.nodeList[parentNode.id]) flowChart.parentNodes.push(parentNode);
			for (const childNode of childNodes) {
				if (flowChart.nodeList[parentNode.id]) {
					if (
						flowChart.nodeList[childNode.id] &&
						flowChart.nodeList[childNode.id].children.some(({ node }) => node.id === parentNode.id)
					) {
						throw new Error('Circular reference detected');
					}
					flowChart.nodeList[parentNode.id].children.push({
						node: flowChart.nodeList[childNode.id] || childNode,
						...edge
					});
				} else {
					parentNode.children.push({
						node: flowChart.nodeList[childNode.id] || childNode,
						...edge
					});
					flowChart.nodeList[parentNode.id] = parentNode;
				}
				if (flowChart.nodeList[childNode.id]) {
					flowChart.nodeList[childNode.id].parents.push({
						node: flowChart.nodeList[parentNode.id] || parentNode
					});
				} else {
					childNode.parents.push({ node: flowChart.nodeList[parentNode.id] || parentNode });
					flowChart.nodeList[childNode.id] = childNode;
				}
				flowChart.parentNodes = flowChart.parentNodes.filter((node) => node.id !== childNode.id);
			}
		}
	}
	return flowChart;
};

/**
 * Parses a line from a mermaid string
 */
function parseLine(line: string) {
	const parentNodes: NodeArray = [];
	const childNodes: NodeArray = [];
	const trimmedLine = line.trim();
	let edgeString = '';

	const edgeStringArray = trimmedLine.match(edgeRegex);
	if (edgeStringArray) edgeString = edgeStringArray[0];
	else throw new Error('Invalid edge');

	const [parentNodesString, childNodesString] = trimmedLine.split(edgeString);
	for (const parentNode of parentNodesString.split('&')) parentNodes.push(nodeParser(parentNode));
	for (const childNode of childNodesString.split('&')) childNodes.push(nodeParser(childNode));
	
	const edgeData = edgeParser(edgeString);
	return { parentNodes, childNodes, edge: edgeData };
}

/**
 * Parses a node from a mermaid string
 */
function nodeParser(node: string): FlowNode {
	node = node.trim();
	const id = node[0];
	const body = node.slice(1);
	let label = '';
	let shape = '';
	const type = 'Default';
	const data = { shape: '', content: '' };
	const bracketStack: Array<OpenBracket> = [];

	for (let i = 0; i < body.length; i++) {
		if (isOpenBracket(body[i])) bracketStack.push(body[i] as OpenBracket);
		else if (bracketRef[bracketStack[bracketStack.length - 1]] === body[i]) {
			shape = shapeRef[bracketStack.join('')];
			break;
		} else label += body[i];
	}
	data.shape = shape;
	data.content = label;
	return { id, data, type, children: [], parents: [], depth: 0, nesting: 0 };
}

/**
 * Parses an edge from a mermaid string
 */
function edgeParser(edge: string): Partial<Edge> {
	edge = edge.trim();
	let edgeStyle = '';
	const [edgeLine, content] = edge.split('|');
	const key = edgeLine[0];
	
	if (key in edgeRef) edgeStyle = edgeRef[key];
	else throw new Error('Not a valid edge type');
	
	const baseEdge: Partial<Edge> = {
		style: edgeStyle,
		width: Math.floor((edgeLine.trim().length - 1) / 2)
	};
	
	if (content) {
		baseEdge.label = content.trim();
	}
	
	return baseEdge;
}

/**
 * Type guard for open brackets
 */
function isOpenBracket(key: string): key is OpenBracket {
	return key in bracketRef;
}