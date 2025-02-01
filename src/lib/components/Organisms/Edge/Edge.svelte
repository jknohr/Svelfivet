<svelte:options runes={true} />

<script lang="ts">
	import { calculateStepPath, calculateRadius, calculatePath, calculateSubwayPath, calculateHorizontalPath, calculateVerticalPath, calculateDagrePath, calculateTokyoPath } from '$lib/utils/calculators';
	import { getContext } from 'svelte';
	import { directionVectors, stepBuffer } from '$lib/constants';
	import { buildPath, rotateVector } from '$lib/utils/helpers';
	import { buildArcStringKey, constructArcString } from '$lib/utils/helpers';
	import type { CSSColorString, Direction, XYPair } from '$lib/types/general';
	import type { Graph } from '$lib/components/Templates/Canvas/Graph/Graph.types';
	import type { EdgeStyle, EndStyle, WritableEdge, EdgeProps } from './Edge.types';
	import type { VectorPlusPosition } from '$lib/utils/calculators/calculateStepPath';

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

	interface $$Props extends EdgeProps {}

	let props = $props<$$Props>();

	// Props
	let {
		edge = getContext<WritableEdge>('edge'),
		straight = false,
		step = false,
		edgeStyle: style = getContext<EdgeStyle>('edgeStyle') || 'bezier',
		start = getContext<EndStyle[]>('endStyles')?.[0],
		end = getContext<EndStyle[]>('endStyles')?.[1],
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
		sourcePosition: initialSourcePosition = { x: 0, y: 0 },
		targetPosition: initialTargetPosition = { x: 0, y: 0 },
		sourceNodePosition: initialSourceNodePosition = { x: 0, y: 0 },
		targetNodePosition: initialTargetNodePosition = { x: 0, y: 0 },
		edgeColor = null,
		source = null,
		target = null,
		flowAnimation = 'none',
		dotSize = 4,
		dotOpacity = 0.75,
		dotColor = null,
		lineWidth = null,
		dynamic = false
	} = props;

	// Context
	const edgeStore = getContext<ReturnType<typeof import('$lib/utils/creators/createEdgeStore').createEdgeStore>>('edgeStore');
	const raiseEdgesOnSelect = getContext<boolean>('raiseEdgesOnSelect');
	const edgesAboveNode = getContext<boolean>('edgesAboveNode');

	// State
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

	// Position state
	let sourcePosition = $state(initialSourcePosition);
	let targetPosition = $state(initialTargetPosition);
	let sourceNodePosition = $state(initialSourceNodePosition);
	let targetNodePosition = $state(initialTargetNodePosition);
	let sourceX = $derived(sourcePosition.x);
	let sourceY = $derived(sourcePosition.y);
	let targetX = $derived(targetPosition.x);
	let targetY = $derived(targetPosition.y);

	// Derived values
	let isConnected = $derived(!!source && !!target);
	let edgeLabel = $derived(label || edge?.label?.text || '');
	let isMoving = $derived(sourceMoving || targetMoving);
	let deltaX = $derived(Math.abs(sourceNodePosition.x - targetNodePosition.x));
	let deltaY = $derived(Math.abs(sourceNodePosition.y - targetNodePosition.y));
	let sourceZIndex = $derived(source?.zIndex || 0);
	let targetZIndex = $derived(target?.zIndex || 0);
	let maxZIndex = $derived(Math.max(sourceZIndex, targetZIndex));
	let zIndex = $derived(edgesAboveNode ? maxZIndex + 1 : maxZIndex - 1);

	// Control points
	let sourceControlVector = $state<XYPair>({ x: 0, y: 0 });
	let targetControlVector = $state<XYPair>({ x: 0, y: 0 });
	let anchorWidth = $state(100); // Default value, should be updated based on context
	let anchorHeight = $state(100); // Default value, should be updated based on context
	let sourceControlX = $derived(sourceX + sourceControlVector.x * anchorWidth);
	let sourceControlY = $derived(sourceY + sourceControlVector.y * anchorHeight);
	let targetControlX = $derived(targetX + targetControlVector.x * anchorWidth);
	let targetControlY = $derived(targetY + targetControlVector.y * anchorHeight);
	let controlPointString = $derived(`${sourceControlX},${sourceControlY} ${targetControlX},${targetControlY}`);

	// Effects
	$effect(() => {
		if (!isConnected) return;
		
		const sourceDir = directionVectors[sourceDirection];
		const targetDir = directionVectors[targetDirection];

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

		// Calculate path based on style
		const effectiveStyle = straight ? 'straight' : step ? 'step' : style;
		let pathData: string;

		switch (effectiveStyle) {
			case 'step':
				const steps = calculateStepPath(sourceVec, targetVec, stepBuffer);
				pathData = steps.reduce((acc, step) => `${acc} L ${step.x},${step.y}`, `M ${sourceX},${sourceY}`);
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

	// Label position tracking
	$effect(() => {
		if (!DOMPath || !isConnected) return;
		const point = calculatePath(DOMPath, labelPosition);
		if (point) {
			labelPoint = point;
		}
	});

	// Dynamic edge direction
	$effect(() => {
		if (isDynamic && source?.node && target?.node) {
			prefersVertical = deltaY > deltaX;
			sourceAbove = sourceNodePosition.y < targetNodePosition.y;
			sourceLeft = sourceNodePosition.x < targetNodePosition.x;

			if (sourceDynamic || targetDynamic) {
				const newSourceDirection = prefersVertical
					? (sourceAbove ? 'south' : 'north')
					: (sourceLeft ? 'east' : 'west');
				const newTargetDirection = prefersVertical
					? (sourceAbove ? 'north' : 'south')
					: (sourceLeft ? 'west' : 'east');

				if (sourceDynamic) sourceDirection = newSourceDirection as Direction;
				if (targetDynamic) targetDirection = newTargetDirection as Direction;
			}
		}
	});

	// Edge movement
	function moveEdge(element: SVGElement | null) {
		if (!element) return;
		const parentNode = element.parentNode;
		if (!parentNode) return;
		parentNode.removeChild(element);
		const newContainer = document.querySelector('.svelvet-graph-wrapper');
		if (!newContainer) return;
		newContainer.appendChild(element);
	}

	$effect(() => {
		if (!edgeElement || !isMoving) return;
		moveEdge(edgeElement);
	});

	// Event handlers
	function handleClick(event: MouseEvent) {
		if (edgeClick) {
			edgeClick(event);
		}
	}

	function handleHover(isHovering: boolean) {
		if (!enableHover) return;
		hovering = isHovering;
	}

	function trackPath() {
		if (!tracking) return;
		if (DOMPath) {
			labelPoint = calculatePath(DOMPath, labelPosition);
		}
		animationFrameId = requestAnimationFrame(trackPath);
	}

	function destroy() {
		if (!source?.id || !target?.id) return;
		const edgeKeys = edgeStore.match(source, target);
		if (edgeKeys.length > 0) {
			edgeStore.remove(edgeKeys[0]);
			source?.connected.update((connected: Set<any>) => {
				if (target) connected.delete(target);
				return connected;
			});
			target?.connected.update((connected: Set<any>) => {
				if (source) connected.delete(source);
				return connected;
			});
		}
	}

	// Cleanup
	$effect(() => {
		return () => {
			edgeElement?.remove();
			if (animationFrameId) {
				cancelAnimationFrame(animationFrameId);
			}
		};
	});

	// Mark edge as rendered
	edge.rendered.set(true);
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
					<polygon class="arrow" points="0 0, 15 5, 0 10" style:--prop-edge-color={color || edgeColor || null} />
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
					<polygon class="arrow" points="0 5, 15 0, 15 10" style:--prop-edge-color={color || edgeColor || null} />
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
			onclick={handleClick}
			onmouseenter={() => handleHover(true)}
			onmouseleave={() => handleHover(false)}
			bind:this={DOMPath}
		/>

		{#snippet edgeContent()}
			<path
				id={edgeKey}
				class="edge"
				class:animate
				d={path}
				style:--prop-edge-color={color || edgeColor || null}
				marker-end={end === 'arrow' ? `url(#${edgeKey + '-end-arrow'})` : ''}
				marker-start={start === 'arrow' ? `url(#${edgeKey + '-start-arrow'})` : ''}
				style:--prop-stroke-width={(lineWidth || width) ? (lineWidth || width) + 'px' : null}
			/>
		{/snippet}
		{@render edgeContent()}

		{#if edgeLabel}
			<foreignObject x={labelPoint.x} y={labelPoint.y} width="100%" height="100%">
				<span class="label-wrapper">
					{#snippet label(destroy: () => void, hovering: boolean)}
						<div
							class="default-label"
							style:--prop-label-color={labelColor}
							style:--prop-label-text-color={textColor}
						>
							{edgeLabel}
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
				style:stroke={dotColor || color || edgeColor || 'var(--accent-color, var(--default-edge-color))'}
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

<div class="edge" {...props}>
	<slot />
</div>
