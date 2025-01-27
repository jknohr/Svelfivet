<script lang="ts">
	import type { ComponentType } from 'svelte';
	import { getContext, onDestroy, onMount, setContext } from 'svelte';
	import type { NodeKey, Anchor, AnchorKey, XYPair, Node as NodeType } from '$lib/types';
	import type { Graph, NodeConfig, GroupKey } from '$lib/types';
	import type { Connections, CSSColorString, InitialDimensions } from '$lib/types';
	import { createNode } from '$lib/utils';
	import InternalNode from './InternalNode.svelte';
	import DefaultNode from './DefaultNode.svelte';

	// Base units in pixels
	const BASE = {
		UNIT: 8,
		XXS: 2,    // 0.25 * BASE_UNIT
		XS: 4,     // ~0.382 * BASE_UNIT
		S: 6,      // ~0.618 * BASE_UNIT
		M: 8,      // 1.0 * BASE_UNIT
		L: 12,     // ~1.618 * BASE_UNIT
		XL: 16,    // ~2.618 * BASE_UNIT
		XXL: 24    // ~4.236 * BASE_UNIT
	} as const;

	// Props
	interface Props {
		position: XYPair;
		drop?: 'cursor' | 'center';
		dimensions?: InitialDimensions | null;
		id?: number;
		bgColor?: CSSColorString | null;
		borderRadius?: number | null;
		borderColor?: CSSColorString | null;
		borderWidth?: number | null;
		selectionColor?: CSSColorString | null;
		textColor?: CSSColorString | null;
		resizable?: boolean;
		label?: string;
		inputs?: number;
		outputs?: number;
		width?: number;
		height?: number;
		TD?: boolean;
		LR?: boolean;
		zIndex?: number;
		editable?: boolean;
		locked?: boolean;
		rotation?: number;
		edge?: any | null;
		connections?: Connections[];
		useDefaults?: boolean;
		center?: boolean;
		dynamic?: boolean;
		title?: string;
		node?: NodeType;
		selected?: boolean;
	}

	let { 
		position = { x: 0, y: 0 } as XYPair,
		drop = 'cursor',
		dimensions = null,
		id = 0,
		bgColor = null,
		borderRadius = null,
		borderColor = null,
		borderWidth = null,
		selectionColor = null,
		textColor = null,
		resizable = false,
		label = '',
		inputs = 1,
		outputs = 1,
		width = 200,
		height = 150,
		TD = false,
		LR = false,
		zIndex = 1,
		editable = true,
		locked = false,
		rotation = 0,
		edge = null,
		connections = [],
		useDefaults = false,
		center = false,
		dynamic = false,
		title = '',
		node: initialNode = null,
		selected = $bindable(false)
	} = $props();

	// Context
	const graph = getContext<Graph>('graph');
	const group = getContext<GroupKey>('group');

	setContext('dynamic', dynamic);

	// State
	let node = $state<NodeType | null>(initialNode);
	let isDefault = $state(true);
	let priorPosition = $state<XYPair>(position);
	let grabHandle = $state<any>(null);

	// Derived values
	let nodeScale = $derived(() => {
		if (!node?.dimensions) return 1;
		const size = Math.min(node.dimensions.width, node.dimensions.height);
		return Math.max(0.8, Math.min(1.5, Math.log10(size / 100) + 1));
	});

	let gridGap = Number(BASE.M);
	let nodePadding = Number(BASE.M);
	let contentMargin = Number(BASE.S);
	let nodeRadius = Number(BASE.M);
	let inputRadius = Number(BASE.S);
	let buttonRadius = Number(BASE.XS);

	// Effects
	$effect(() => {
		if (!node) {
			const config: NodeConfig = {
				id,
				label,
				inputs,
				outputs,
				width,
				height,
				dimensions,
				position,
				bgColor,
				borderRadius,
				borderColor,
				borderWidth,
				selectionColor,
				textColor,
				resizable,
				zIndex,
				editable,
				locked,
				rotation,
				edge,
				connections
			};
			node = createNode(config);
		}
	});

	$effect(() => {
		if (node) {
			node.position = position;
		}
	});

	onDestroy(() => {
		node = null;
	});

	function connect(connections: number | string | [number | string, number | string]) {
		if (!node) return;
		node.connections = [connections];
	}

	function disconnect(connections: number | string | Connections) {
		if (!node) return;
		const adjustedConnections = Array.isArray(connections) ? connections : [connections];

		adjustedConnections.forEach((connection) => {
			const [nodeId, anchorId] = Array.isArray(connection) ? [connection[0], connection[1]] : [connection, null];
			const nodeKey: NodeKey = `N-${nodeId}`;
			const otherNode = graph.nodes.get(nodeKey);
			if (!otherNode) return;
			let specificAnchor: Anchor | null = null;
			const anchorKey: AnchorKey | null = anchorId ? `A-${anchorId}/${nodeKey}` : null;
			if (anchorKey) {
				specificAnchor = otherNode.anchors.get(anchorKey);
			}
			const matchingEdgeKeys = graph.edges.match(node, otherNode, specificAnchor);
			if (matchingEdgeKeys.length)
				graph.edges.delete(matchingEdgeKeys[matchingEdgeKeys.length - 1]);
		});
	}

	setContext('connect', connect);
	setContext('disconnect', disconnect);

	$effect(() => {
		if (node) {
			node.bgColor = bgColor;
		}
	});
	$effect(() => {
		if (node) {
			node.label = label;
		}
	});
	$effect(() => {
		if (node) {
			node.textColor = textColor;
		}
	});
	$effect(() => {
		if (node) {
			node.borderColor = borderColor;
		}
	});
	$effect(() => {
		if (node) {
			node.selectionColor = selectionColor;
		}
	});
	$effect(() => {
		if (node) {
			node.resizable = resizable;
		}
	});
	$effect(() => {
		if (node) {
			node.editable = editable;
		}
	});
	$effect(() => {
		if (node) {
			node.locked = locked;
		}
	});
	$effect(() => {
		if (node) {
			node.inputs = inputs;
		}
	});
	$effect(() => {
		if (node) {
			node.outputs = outputs;
		}
	});
	$effect(() => {
		if (node) {
			node.zIndex = zIndex;
		}
	});

	let nodePosition = $state<XYPair>({ x: 0, y: 0 });
	
	$effect(() => {
		nodePosition = node?.position || { x: 0, y: 0 };
	});

	// Validation for node properties
	const validateNodeProps = () => {
		if (bgColor !== null && typeof bgColor !== 'string') {
			throw new Error('Invalid value for bgColor property');
		}
		if (borderColor !== null && typeof borderColor !== 'string') {
			throw new Error('Invalid value for borderColor property');
		}
		if (label !== null && typeof label !== 'string') {
			throw new Error('Invalid value for label property');
		}
		if (width !== null && typeof width !== 'number') {
			throw new Error('Invalid value for width property');
		}
		if (height !== null && typeof height !== 'number') {
			throw new Error('Invalid value for height property');
		}
		if (locked !== null && typeof locked !== 'boolean') {
			throw new Error('Invalid value for locked property');
		}
		if (center !== null && typeof center !== 'boolean') {
			throw new Error('Invalid value for center property');
		}
		if (inputs !== null && typeof inputs !== 'number') {
			throw new Error('Invalid value for inputs property');
		}
		if (outputs !== null && typeof outputs !== 'number') {
			throw new Error('Invalid value for outputs property');
		}
		if (rotation !== null && typeof rotation !== 'number') {
			throw new Error('Invalid value for rotation property');
		}
		if (zIndex !== null && typeof zIndex !== 'number') {
			throw new Error('Invalid value for zIndex property');
		}
		if (TD !== null && typeof TD !== 'boolean') {
			throw new Error('Invalid value for TD property');
		}
		if (LR !== null && typeof LR !== 'boolean') {
			throw new Error('Invalid value for LR property');
		}
		if (useDefaults !== null && typeof useDefaults !== 'boolean') {
			throw new Error('Invalid value for useDefaults property');
		}
	};

	validateNodeProps();

	// Template
</script>

<div
	class="node-wrapper"
	style:--grid-gap="{gridGap}px"
	style:--node-padding="{nodePadding}px"
	style:--content-margin="{contentMargin}px"
	style:--node-radius="{nodeRadius}px"
	style:--input-radius="{inputRadius}px"
	style:--button-radius="{buttonRadius}px"
>
	{#if node && isDefault}
		<DefaultNode 
			bind:selected
			{node}
			{width}
			{height}
			{locked}
			{title}
		/>
	{:else if node}
		<InternalNode
			{node}
			{width}
			{height}
			{locked}
			{title}
			bind:selected
		/>
	{/if}

	{#if node}
		<div class="anchors">
			{#if !TD}
				<div id="west-{node.id}" class="anchor left"></div>
				<div id="east-{node.id}" class="anchor right"></div>
			{/if}
			{#if !LR}
				<div id="north-{node.id}" class="anchor top"></div>
				<div id="south-{node.id}" class="anchor bottom"></div>
			{/if}
		</div>
	{/if}
</div>

<style>
	.node-wrapper {
		position: relative;
		display: grid;
		grid-gap: var(--grid-gap);
		padding: var(--node-padding);
	}

	.anchors {
		position: absolute;
		inset: 0;
		pointer-events: none;
	}

	.anchor {
		position: absolute;
		width: var(--input-radius);
		height: var(--input-radius);
		pointer-events: auto;
	}

	.left { left: 0; top: 50%; transform: translate(-50%, -50%); }
	.right { right: 0; top: 50%; transform: translate(50%, -50%); }
	.top { top: 0; left: 50%; transform: translate(-50%, -50%); }
	.bottom { bottom: 0; left: 50%; transform: translate(-50%, 50%); }
</style>
