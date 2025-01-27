import type { SvelteComponent } from 'svelte';
import type { AnchorStore, CSSDimensionString, InitialDimensions, Connections, Direction } from '.';
import type { XYPair, NodeKey, Dimensions, CSSColorString, GroupKey } from '.';

// This defines an interface for the actual node object that is used in the graph/stores
export interface Node {
	id: NodeKey;
	rotation: number;
	position: XYPair;

	moving: boolean;
	label: string; // Primary label for default node
	dimensions: Dimensions;
	inputs: number; //Number of default input anchors to render
	outputs: number; // Number of default output anchors to render
	anchors: AnchorStore;
	group: GroupKey | null;
	collapsed: boolean;
	// visible: Writable<boolean>;
	resizingWidth: boolean;
	resizingHeight: boolean;
	rotating: boolean;
	editable: boolean;
	locked: boolean;
	recalculateAnchors: (direction?: Direction) => void;
	// selectable: Writable<boolean>;
	// connectable: Writable<boolean>;
	// collapsible: Writable<boolean>;
	// deletable: Writable<boolean>;
	// hideable: Writable<boolean>;
	// focusable: Writable<boolean>;
	resizable: boolean;
	zIndex: number;
	edge: typeof SvelteComponent | null;
	// ariaLabel: string;
	direction: 'TD' | 'LR';
	borderRadius: number;
	borderWidth: number;
	connections: Connections;
	bgColor: CSSColorString | null;
	borderColor: CSSColorString | null;
	selectionColor: CSSColorString | null;
	textColor: CSSColorString | null;
}

// This defines an interface for the node object
// Passed to the createNode function
export interface NodeConfig {
	id?: string | number;
	dimensions?: InitialDimensions;
	position?: {
		x: number;
		y: number;
	};
	direction?: 'TD' | 'LR';
	zIndex?: number;
	label?: string;
	group?: GroupKey;
	editable?: boolean;
	resizable?: boolean;
	inputs?: number;
	outputs?: number;
	locked?: boolean;
	selectionColor?: CSSColorString;
	component?: typeof SvelteComponent;
	width?: number;
	height?: number;
	header?: true;
	props?: object;
	borderColor?: CSSColorString;
	bgColor?: CSSColorString;
	useDefaults?: boolean;
	borderRadius?: number;
	borderWidth?: number;
	rotation?: number;
	textColor?: CSSColorString;
	connections?: Connections;
	edge?: typeof SvelteComponent;
}

export type UserDimension = number | CSSDimensionString;
