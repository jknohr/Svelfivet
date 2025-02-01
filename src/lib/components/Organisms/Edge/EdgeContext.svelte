<svelte:options runes={true} />

<script lang="ts">
	import type { EdgeProps } from './Edge.types';
	import { getContext } from 'svelte';
	import type { CSSColorString } from '$lib/types/general';

	let {
		edge,
		straight = false,
		step = false,
		edgeStyle = undefined,
		start = undefined,
		end = undefined,
		animate = false,
		labelText = '',
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
		sourceDirection = undefined,
		targetDirection = undefined,
		sourceRotation = 0,
		targetRotation = 0,
		sourceMoving = false,
		targetMoving = false,
		sourcePosition = { x: 0, y: 0 },
		targetPosition = { x: 0, y: 0 },
		sourceNodePosition = { x: 0, y: 0 },
		targetNodePosition = { x: 0, y: 0 },
		edgeColor = null,
		source = null,
		target = null,
		flowAnimation = 'none',
		dotSize = 4,
		dotOpacity = 0.75,
		dotColor = null,
		lineWidth = null,
		dynamic = false,
		children = undefined,
		labelSnippet = undefined
	} = $props();

	// State
	let edgeStatus = $state('default');
	let healthScore = $state(100);
	let flowRate = $state(1);
	let metadata = $state<Record<string, any>>({});

	// Derived values
	let isHealthy = $derived(healthScore >= 75);
	let isWarning = $derived(healthScore >= 25 && healthScore < 75);
	let isDanger = $derived(healthScore < 25);
	let effectiveColor = $derived(() => {
		if (color) return color;
		if (isDanger) return 'var(--danger-color, red)';
		if (isWarning) return 'var(--warning-color, orange)';
		if (isHealthy) return 'var(--success-color, green)';
		return edgeColor;
	});

	// Effects
	$effect(() => {
		if (edge) {
			edge.rendered.set(true);
		}
	});

	$effect(() => {
		if (edge?.config) {
			metadata = {
				...metadata,
				status: edgeStatus,
				healthScore,
				flowRate
			};
		}
	});

	$effect(() => {
		if (flowAnimation !== 'none') {
			flowRate = flowAnimation === 'backward' ? -1 : 1;
		}
	});

	// Context setup
	const graph = getContext<any>('graph');
	const edgeStore = getContext<any>('edgeStore');

	// Event handlers
	function handleEdgeClick(event: MouseEvent) {
		if (edgeClick) {
			edgeClick(event);
		}
	}
</script>

{#if edge}
	{@render children?.({
		edge,
		straight,
		step,
		edgeStyle: edgeStyle || edge.config?.type,
		start: start || edge.config?.start,
		end: end || edge.config?.end,
		animate,
		label: labelText || edge.config?.label?.text,
		enableHover,
		edgeClick: handleEdgeClick,
		labelPosition: labelPosition || edge.config?.label?.position,
		width: width || edge.config?.width,
		color: effectiveColor || edge.config?.color,
		labelColor: labelColor || edge.config?.labelColor,
		textColor: textColor || edge.config?.textColor,
		cornerRadius,
		targetColor: targetColor || edge.config?.targetColor,
		edgeKey,
		edgeType,
		sourceDynamic,
		targetDynamic,
		sourceDirection,
		targetDirection,
		sourceRotation,
		targetRotation,
		sourceMoving,
		targetMoving,
		sourcePosition,
		targetPosition,
		sourceNodePosition,
		targetNodePosition,
		source,
		target,
		flowAnimation: flowAnimation || edge.config?.flowAnimation,
		dotSize: dotSize || edge.config?.dotSize,
		dotOpacity: dotOpacity || edge.config?.dotOpacity,
		dotColor: dotColor || edge.config?.dotColor,
		lineWidth: lineWidth || edge.config?.lineWidth,
		dynamic
	})}
	{#if labelSnippet}
		{@render labelSnippet({ destroy: () => {}, hovering: false })}
	{/if}
{/if}
