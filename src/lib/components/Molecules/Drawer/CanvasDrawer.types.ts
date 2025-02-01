import type { CSSColorString } from '../../Templates/Canvas/types/general';
import { SvelteComponent } from 'svelte';
import type { NodeConfig, EdgeStyle, XYPair, DrawerDirection } from '../../Templates/Canvas/types';
import type { NodeConfig as NodeConfigType } from '$lib/components/Templates/Canvas/types';

export type { CSSColorString };

export interface AnchorDrawerConfig {
    invisible?: boolean;
    nodeConnect?: boolean;
    input?: boolean;
    output?: boolean;
    multiple?: boolean;
    direction?: DrawerDirection;
    dynamic?: boolean;
    edgeLabel?: string;
    locked?: boolean;
    bgColor?: CSSColorString;
    edge?: typeof SvelteComponent;
}

export type AnchorProps = [
    invisible: boolean | undefined,
    nodeConnect: boolean | undefined,
    input: boolean | undefined,
    output: boolean | undefined,
    multiple: boolean | undefined,
    direction: DrawerDirection | undefined,
    dynamic: boolean | undefined,
    anchorEdgeLabel: string | undefined,
    anchorLocked: boolean | undefined,
    anchorBgColor: CSSColorString | undefined,
    edge: typeof SvelteComponent | undefined
];

export type EdgeProps = [
	width: number | undefined,
	targetColor: CSSColorString | undefined,
	color: CSSColorString | undefined,
	straight: boolean | undefined,
	step: boolean | undefined,
	cornerRadius: number | undefined,
	animate: boolean | undefined,
	label: string | undefined,
	labelColor: CSSColorString | undefined,
	textColor: CSSColorString | undefined
];

export interface EdgeDrawerConfig {
    width?: number;
    targetColor?: CSSColorString;
    color?: CSSColorString;
    straight?: boolean;
    step?: boolean;
    cornerRadius?: number;
    animate?: boolean;
    label?: string;
    labelColor?: CSSColorString;
    textColor?: CSSColorString;
}

export interface NodeDrawerConfig extends NodeConfig {
    bgColor?: CSSColorString;
    borderColor?: CSSColorString;
    label?: string;
    width?: number;
    height?: number;
    locked?: boolean;
    center?: boolean;
    inputs?: number;
    outputs?: number;
    rotation?: number;
    zIndex?: number;
    TD?: boolean;
    LR?: boolean;
    useDefaults?: boolean;
    nodeDirection?: string;
    anchors?: {
        left?: AnchorDrawerConfig[];
        right?: AnchorDrawerConfig[];
        top?: AnchorDrawerConfig[];
        bottom?: AnchorDrawerConfig[];
        self?: AnchorDrawerConfig[];
    };
    edgeProps?: EdgeDrawerConfig;
}

export type NodeProps = [
	bgColor: CSSColorString | undefined,
	borderColor: CSSColorString | undefined,
	label: string | undefined,
	width: number,
	height: number,
	locked: boolean | undefined,
	center: boolean | undefined,
	inputs: number | undefined,
	outputs: number | undefined,
	rotation: number | undefined,
	zIndex: number | undefined,
	TD: boolean | undefined,
	LR: boolean | undefined,
	useDefaults: boolean | undefined
];

export interface SvelvetConfig {
	width: number;
	height: number;
	minimap: boolean;
	translation: XYPair;
	controls: boolean;
	edge: typeof SvelteComponent | null;
	edgeStyle: EdgeStyle;
	snapTo: number;
	editable: boolean;
	fitView: boolean | 'resize';
	locked: boolean;
	zoom: number;
	theme: string;
	mermaid: string;
	mermaidConfig: Record<string, NodeConfig>;
	TD: boolean;
	disableSelection: boolean;
	raiseEdgesOnSelect: boolean | 'source' | 'target';
	modifier: 'alt' | 'ctrl' | 'shift' | 'meta';
	trackpadPan: boolean;
	toggle: boolean;
}
