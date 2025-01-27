<!-- @migration-task Error while migrating Svelte code: Unexpected token
https://svelte.dev/e/js_parse_error -->
<!-- @migration-task Error while migrating Svelte code: Unexpected token
https://svelte.dev/e/js_parse_error -->
<script lang="ts">
	import { calculateStepPath, calculateRadius, calculatePath, calculateSubwayPath, calculateHorizontalPath, calculateVerticalPath, calculateDagrePath, calculateTokyoPath } from '$lib/utils/calculators';
	import { onMount, onDestroy, getContext } from 'svelte';
	import { directionVectors, stepBuffer } from '$lib/constants';
	import { buildPath, rotateVector } from '$lib/utils/helpers';
	import { buildArcStringKey, constructArcString } from '$lib/utils/helpers';
	import { get } from 'svelte/store';
	import type { CSSColorString, Direction, EdgeStyle, EndStyle, Graph, WritableEdge, XYPair, Node } from '$lib/types';
	import type { VectorPlusPosition } from '$lib/utils/calculators/calculateStepPath';

	interface Props {
		edge?: WritableEdge;
		straight?: boolean;
		step?: boolean;
		start?: EndStyle;
		end?: EndStyle;
		animate?: boolean;
		label?: string;
		enableHover?: boolean;
		edgeClick?: ((event: MouseEvent) => void) | null;
		labelPosition?: number;
		width?: number | null;
		color?: CSSColorString | null;
		labelColor?: CSSColorString | null;
		textColor?: CSSColorString | null;
		cornerRadius?: number;
		targetColor?: CSSColorString | null;
		edgeKey?: string;
		edgeType?: string;
		sourceDynamic?: boolean;
		targetDynamic?: boolean;
		sourceDirection?: Direction;
		targetDirection?: Direction;
		sourceRotation?: number;
		targetRotation?: number;
		sourceMoving?: boolean;
		targetMoving?: boolean;
		sourcePositionStore?: XYPair;
		targetPositionStore?: XYPair;
		sourceNodePositionStore?: XYPair;
		targetNodePositionStore?: XYPair;
		edgeColor?: CSSColorString | null;
		source?: Node | null;
		target?: Node | null;
		edgeStyle?: EdgeStyle;
		flowAnimation?: 'none' | 'forward' | 'backward' | 'bidirectional';
		dotSize?: number;
		dotOpacity?: number;
		dotColor?: CSSColorString | null;
		lineWidth?: number | null;
		dynamic?: boolean;
	}

	interface Connected {
		source: {
			height: number;
			width: number;
			position: XYPair;
			dynamic: boolean;
			direction: Direction;
			rotation: number;
		};
		target: {
			height: number;
			width: number;
			position: XYPair;
			dynamic: boolean;
			direction: Direction;
			rotation: number;
		};
	}

	const props = $props();
	const edgeStore = getContext<Graph['edges']>('edgeStore');
	const edgeStyle = getContext<EdgeStyle>('edgeStyle');
	const endStyles = getContext<Array<EndStyle>>('endStyles');
	const raiseEdgesOnSelect = getContext('raiseEdgesOnSelect');
	const edgesAboveNode = getContext('edgesAboveNode');

	let { 
		edge = getContext<WritableEdge>('edge'),
		straight = false,
		step = false,
		edgeStyle: style = edgeStyle || 'bezier',
		start = endStyles[0],
		end = endStyles[1],
		animate = false,
		label = '',
		enableHover = false,
		edgeClick = null,
		labelPosition = 0.5,
		width = null,
		color = null,
		labelColor = null,
		textColor = null,
		cornerRadius = 8,
		targetColor = null,
		edgeKey = '',
		edgeType = '',
		sourceDynamic = false,
		targetDynamic = false,
		sourceDirection = 'north' as Direction,
		targetDirection = 'south' as Direction,
		sourceRotation = 0,
		targetRotation = 0,
		sourceMoving = false,
		targetMoving = false,
		sourcePositionStore = { x: 0, y: 0 },
		targetPositionStore = { x: 0, y: 0 },
		sourceNodePositionStore = { x: 0, y: 0 },
		targetNodePositionStore = { x: 0, y: 0 },
		edgeColor = null,
		source = null,
		target = null,
		flowAnimation = 'none',
		dotSize = 4,
		dotOpacity = 0.75,
		dotColor = null,
		lineWidth = null,
		dynamic = false,
	} = props;

	let isDynamic = $state(dynamic);

	let animationFrameId = $state(0);
	let path = $state('');
	let DOMPath = $state<SVGPathElement | null>(null);
	let labelPoint = $state<XYPair>({ x: 0, y: 0 });
	let tracking = $state(false);
	let prefersVertical = $state(false);
	let sourceAbove = $state(false);
	let sourceLeft = $state(false);
	let hovering = $state(false);
	let edgeElement = $state<SVGElement | null>(null);
	let sourcePosition = $state<XYPair>(sourcePositionStore);
	let targetPosition = $state<XYPair>(targetPositionStore);
	let sourceNodePosition = $state<XYPair>(sourceNodePositionStore);
	let targetNodePosition = $state<XYPair>(targetNodePositionStore);
	let sourceX = $state(sourcePositionStore.x);
	let sourceY = $state(sourcePositionStore.y);
	let targetX = $state(targetPositionStore.x);
	let targetY = $state(targetPositionStore.y);
	let deltaX = $state(0);
	let deltaY = $state(0);
	let anchorWidth = $state(0);
	let anchorHeight = $state(0);
	let maxCurveDisplaceX = $state(0);
	let maxCurveDisplaceY = $state(0);
	let sourceControlVector = $state<XYPair>({ x: 0, y: 0 });
	let targetControlVector = $state<XYPair>({ x: 0, y: 0 });
	let sourceControlX = $state(0);
	let sourceControlY = $state(0);
	let targetControlX = $state(0);
	let targetControlY = $state(0);
	let controlPointString = $state('');
	let sourceZIndex = $state(source?.zIndex || 0);
	let targetZIndex = $state(target?.zIndex || 0);
	let maxZIndex = $state(0);
	let zIndex = $state(0);
	let renderLabel = $state(!!label || !!edge?.label?.text);
	let sourceHeight = $state<number>(0);
	let targetHeight = $state<number>(0);
	let sourceWidth = $state<number>(0);
	let targetWidth = $state<number>(0);

	// Derived values
	let edgeLabel = $derived(label || edge?.label?.text || '');
	let isMoving = $derived(sourceMoving || targetMoving);
	let isConnected = $derived(!!source && !!target);

	function moveEdge(element: SVGElement | null) {
		if (!element) return;
		const parentNode = element.parentNode;
		if (!parentNode) return;
		parentNode.removeChild(element);
		const newContainer = document.querySelector(`.svelvet-graph-wrapper`);
		if (!newContainer) return;
		newContainer.appendChild(element);
	}

	// Handle edge movement
	$effect(() => {
		if (!edgeElement || !isMoving) return;
		moveEdge(edgeElement);
	});

	// Update positions
	$effect(() => {
		if (!source || !target) return;
		
		const connected: Connected = {
			source: {
				height: Number(sourceHeight || 0),
				width: Number(sourceWidth || 0),
				position: sourceNodePosition,
				dynamic: sourceDynamic,
				direction: sourceDirection,
				rotation: sourceRotation
			},
			target: {
				height: Number(targetHeight || 0),
				width: Number(targetWidth || 0),
				position: targetNodePosition,
				dynamic: targetDynamic,
				direction: targetDirection,
				rotation: targetRotation
			}
		};

		// Update control vectors
		if (connected.source.direction && connected.target.direction) {
			const sourceDir = directionVectors[connected.source.direction as Direction];
			const targetDir = directionVectors[connected.target.direction as Direction];

			if (sourceDir && targetDir) {
				sourceControlVector = rotateVector(sourceDir, connected.source.rotation);
				targetControlVector = rotateVector(targetDir, connected.target.rotation);

				// Update control points
				sourceControlX = sourceX + sourceControlVector.x * anchorWidth;
				sourceControlY = sourceY + sourceControlVector.y * anchorHeight;
				targetControlX = targetX + targetControlVector.x * anchorWidth;
				targetControlY = targetY + targetControlVector.y * anchorHeight;

				// Build control point string
				controlPointString = `${sourceControlX},${sourceControlY} ${targetControlX},${targetControlY}`;
			}
		}
	});

	// Update path
	$effect(() => {
		if (!isConnected) return;

		const sourceDir = directionVectors[sourceDirection as Direction];
		const targetDir = directionVectors[targetDirection as Direction];

		if (!sourceDir || !targetDir) return;

		const sourceVec: VectorPlusPosition = {
			x: sourceX,
			y: sourceY,
			direction: sourceDir
		};

		const targetVec: VectorPlusPosition = {
			x: targetX,
			y: targetY,
			direction: targetDir
		};

		let pathData: string;
		// Override style if straight or step is true (for backward compatibility)
		const effectiveStyle = straight ? 'straight' : step ? 'step' : style;

		switch (effectiveStyle) {
			case 'step':
				const steps = calculateStepPath(sourceVec, targetVec, stepBuffer);
				pathData = steps.reduce((acc, step) => {
					return `${acc} L ${step.x},${step.y}`;
				}, `M ${sourceX},${sourceY}`);
				break;

			case 'straight':
				pathData = `M ${sourceX},${sourceY} L ${targetX},${targetY}`;
				break;

			case 'subway':
				pathData = calculateSubwayPath(sourceVec, targetVec, cornerRadius);
				break;

			case 'horizontal':
				pathData = calculateHorizontalPath(sourceVec, targetVec, cornerRadius);
				break;

			case 'vertical':
				pathData = calculateVerticalPath(sourceVec, targetVec, cornerRadius);
				break;

			case 'dagre':
				pathData = calculateDagrePath(sourceVec, targetVec, cornerRadius);
				break;

			case 'tokyo':
				pathData = calculateTokyoPath(sourceVec, targetVec, cornerRadius);
				break;

			case 'bezier':
			default:
				pathData = `M ${sourceX},${sourceY} C ${sourceControlX},${sourceControlY} ${targetControlX},${targetControlY} ${targetX},${targetY}`;
		}

		path = pathData;
	});

	// Calculate label position
	$effect(() => {
		if (!DOMPath || !isConnected) return;
		const point = calculatePath(DOMPath, labelPosition);
		if (point) {
			labelPoint = { x: point.x, y: point.y };
		}
	});

	// Handle cleanup
	onDestroy(() => {
		if (animationFrameId) {
			cancelAnimationFrame(animationFrameId);
		}
	});

	function handleClick(event: MouseEvent) {
		if (edgeClick) {
			edgeClick(event);
		}
	}

	function handleHover(isHovering: boolean) {
		if (!enableHover) return;
		hovering = isHovering;
	}

	$effect(() => {
		if (renderLabel && !tracking && ($sourceMoving || $targetMoving || edgeKey === 'cursor')) {
			tracking = true;
			trackPath();
		} else if (tracking && !$sourceMoving && !$targetMoving && edgeKey !== 'cursor') {
			tracking = false;
			cancelAnimationFrame(animationFrameId);
		}
	});

	$effect(() => {
		if (isDynamic && source.node && target.node) {
			const nodeXDelta = targetNodePosition.x - sourceNodePosition.x;
			const nodeYDelta = targetNodePosition.y - sourceNodePosition.y;
			sourceAbove = nodeYDelta > 0;
			sourceLeft = nodeXDelta > 0;
			let borderDeltaY: number;
			let borderDeltaX: number;
			if (sourceAbove) {
				const sourceHeight = Number(get(source.node.dimensions.height));
				const sourceBottom = sourceNodePosition.y + sourceHeight;
				borderDeltaY = targetNodePosition.y - sourceBottom;
			} else {
				const targetHeight = Number(get(target.node.dimensions.height));
				const targetBottom = targetNodePosition.y + targetHeight;
				borderDeltaY = sourceNodePosition.y - targetBottom;
			}
			if (sourceLeft) {
				const sourceWidth = Number(get(source.node.dimensions.width));
				const sourceRight = sourceNodePosition.x + sourceWidth;
				borderDeltaX = targetNodePosition.x - sourceRight;
			} else {
				const targetWidth = Number(get(target.node.dimensions.width));
				const targetRight = targetNodePosition.x + targetWidth;
				borderDeltaX = sourceNodePosition.x - targetRight;
			}

			prefersVertical = borderDeltaY > borderDeltaX;
		}
	});

	$effect(() => {
		if (isDynamic) {
			let newSourceDirection: Direction;
			let newTargetDirection: Direction;
			if (prefersVertical) {
				newSourceDirection = sourceAbove ? 'south' : 'north';
				newTargetDirection = sourceAbove ? 'north' : 'south';
			} else {
				newSourceDirection = sourceLeft ? 'east' : 'west';
				newTargetDirection = sourceLeft ? 'west' : 'east';
			}
			if ($sourceDynamic) sourceDirection = newSourceDirection;
			if ($targetDynamic) targetDirection = newTargetDirection;
		}
	});

	edge.rendered.set(true);

	onMount(() => {
		setTimeout(() => {
			if (DOMPath) {
				labelPoint = calculatePath(DOMPath, labelPosition);
			}
		}, 0);
		moveEdge(edgeElement);
	});

	onDestroy(() => {
		edgeElement?.remove();
		cancelAnimationFrame(animationFrameId);
	});

	function trackPath() {
		if (!tracking) return;
		if (DOMPath) {
			labelPoint = calculatePath(DOMPath, labelPosition);
		}
		animationFrameId = requestAnimationFrame(trackPath);
	}

	function destroy() {
		if (source.id === null || target.id === null) return;
		const edgeKey = edgeStore.match(source, target);
		edgeStore.delete(edgeKey[0]);
		source?.connected.update((connected: Set<Node>) => {
			if (target) connected.delete(target);
			return connected;
		});
		target?.connected.update((connected: Set<Node>) => {
			if (source) connected.delete(source);
			return connected;
		});
	}

	$effect(() => {
		if (!isConnected) return;
		
		maxZIndex = Math.max(sourceZIndex, targetZIndex);
		zIndex = edgesAboveNode ? maxZIndex + 1 : maxZIndex - 1;

		if (hovering && raiseEdgesOnSelect) {
			zIndex = maxZIndex + 2;
		}
	});

	$effect(() => {
		if (!isConnected) return;

		const arcKey = buildArcStringKey(edgeType, edgeKey);
		if (arcKey) {
			path = constructArcString(cornerRadius, arcKey);
		}
	});

	$effect(() => {
		if (!isConnected) return;

		if (sourceDynamic) {
			sourcePosition = sourcePositionStore;
			sourceX = sourcePosition.x;
			sourceY = sourcePosition.y;
		}

		if (targetDynamic) {
			targetPosition = targetPositionStore;
			targetX = targetPosition.x;
			targetY = targetPosition.y;
		}
	});

	$effect(() => {
		if (!isConnected) return;

		sourceNodePosition = sourceNodePositionStore;
		targetNodePosition = targetNodePositionStore;

		deltaX = Math.abs(sourceNodePosition.x - targetNodePosition.x);
		deltaY = Math.abs(sourceNodePosition.y - targetNodePosition.y);
		
		prefersVertical = deltaY > deltaX;
		sourceAbove = sourceNodePosition.y < targetNodePosition.y;
		sourceLeft = sourceNodePosition.x < targetNodePosition.x;
	});

	// Update positions when source/target positions change
	$effect(() => {
		sourceX = sourcePosition.x;
		sourceY = sourcePosition.y;
		targetX = targetPosition.x;
		targetY = targetPosition.y;
	});
</script>

{#if source && target}
	<svg class="edges-wrapper" style:z-index={zIndex} bind:this={edgeElement}>
		{#if start || end}
			<defs>
				<marker
					id={edgeKey + '-end-arrow'}
					viewBox="0 0 15 15"
					markerWidth="15"
					markerHeight="10"
					refX="12.5"
					refY="5"
					orient="auto"
				>
					<polygon class="arrow" points="0 0, 15 5, 0 10" style:--prop-edge-color={color || $edgeColor || null} />
				</marker>
				<marker
					id={edgeKey + '-start-arrow'}
					viewBox="0 0 15 15"
					markerWidth="15"
					markerHeight="10"
					refX="0"
					refY="5"
					orient="auto"
				>
					<polygon class="arrow" points="0 5, 15 0, 15 10" style:--prop-edge-color={color || $edgeColor || null} />
				</marker>
			</defs>
		{/if}
		<path
			role="presentation"
			id={edgeKey + '-target'}
			class="target"
			class:cursor={edgeKey === 'cursor' || (!edgeClick && !enableHover)}
			style:cursor={edgeClick || hovering ? 'pointer' : 'move'}
			style:--prop-target-edge-color={edgeClick || hovering ? targetColor || null : 'transparent'}
			d={path}
			onmousedown={edgeClick}
			onmouseenter={() => (hovering = true)}
			onmouseleave={() => (hovering = false)}
			bind:this={DOMPath}
		/>
		{#snippet edgeContent()}
			<path
				id={edgeKey}
				class="edge"
				class:animate
				d={path}
				style:--prop-edge-color={color || $edgeColor || null}
				marker-end={end === 'arrow' ? `url(#${edgeKey + '-end-arrow'})` : ''}
				marker-start={start === 'arrow' ? `url(#${edgeKey + '-start-arrow'})` : ''}
				style:--prop-stroke-width={(lineWidth || width) ? (lineWidth || width) + 'px' : null}
			/>
		{/snippet}
		{@render edgeContent()}

		{#if renderLabel}
			<foreignObject x={labelPoint.x} y={labelPoint.y} width="100%" height="100%">
				<span class="label-wrapper">
					{#snippet label(destroy: () => void, hovering: boolean)}
						<div
							class="default-label"
							style:--prop-label-color={labelColor}
							style:--prop-label-text-color={textColor}
						>
							{label || $edgeLabel || ''}
						</div>
					{/snippet}
					{@render label(destroy, hovering)}
				</span>
			</foreignObject>
		{/if}

		{#if flowAnimation !== 'none'}
			<path
				class="flow-dots"
				d={path}
				style:--dot-size="{flowAnimation === 'bidirectional' ? 
					Math.min((lineWidth || width || 2) * 0.75, dotSize) : 
					Math.min(lineWidth || width || 2, dotSize)}px"
				style:--dot-spacing="{flowAnimation === 'bidirectional' ? '20' : '10'}"
				style:--flow-direction="{flowAnimation === 'backward' ? 1 : -1}"
				style:--dot-opacity="{Math.max(0, Math.min(1, dotOpacity))}"
				class:bidirectional={flowAnimation === 'bidirectional'}
				style:stroke={dotColor || color || $edgeColor || 'var(--accent-color, var(--default-edge-color))'}
			/>
		{/if}
	</svg>
{/if}

<style>
	.arrow {
		fill: var(--prop-edge-color, var(--edge-color, var(--default-edge-color))) !important;
	}

	.edge {
		stroke: var(--prop-edge-color, var(--edge-color, var(--default-edge-color)));
		stroke-width: var(--prop-stroke-width, var(--edge-width, var(--default-edge-width)));
		contain: strict;
	}
	.label-wrapper {
		display: flex;
		justify-content: center;
		align-items: center;
		width: fit-content;
		height: fit-content;
		transform: translate(-50%, -50%);
		pointer-events: auto;
	}

	.edges-wrapper {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		fill: transparent;
		overflow: visible;
	}

	.target {
		pointer-events: stroke;
		stroke: none;
		stroke-width: calc(var(--edge-width, var(--default-edge-width)) + 8px);
	}

	.target:hover {
		stroke: var(
			--prop-target-edge-color,
			var(--target-edge-color, var(--default-target-edge-color))
		);
		opacity: 50%;
	}

	.cursor {
		pointer-events: none;
	}

	foreignObject {
		overflow: visible;
	}

	path {
		cursor: pointer;
	}

	.animate {
		stroke-dasharray: 5;
		animation: dash 1s linear infinite;
		will-change: stroke-dashoffset;
	}

	.default-label {
		display: flex;
		justify-content: center;
		align-items: center;
		width: fit-content;
		font-size: 1rem;
		height: 1.5rem;
		border-radius: 5px;
		padding: 10px;
		color: var(--prop-label-text-color, var(--label-text-color, var(--default-label-text-color)));
		background-color: var(--prop-label-color, var(--label-color, var(--default-label-color)));
	}

	@keyframes dash {
		from {
			stroke-dashoffset: 30;
		}
	}

	.flow-dots {
		fill: none;
		stroke-width: var(--dot-size);
		stroke-linecap: round;
		stroke-dasharray: var(--dot-size) calc(var(--dot-size) * var(--dot-spacing));
		animation: flow 1s linear infinite;
		pointer-events: none;
		opacity: var(--dot-opacity);
	}

	.flow-dots.bidirectional {
		stroke-dasharray: var(--dot-size) calc(var(--dot-size) * var(--dot-spacing));
	}

	@keyframes flow {
		to {
			stroke-dashoffset: calc(var(--flow-direction) * var(--dot-size) * (var(--dot-spacing) + 1));
		}
	}
</style>
