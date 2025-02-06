<svelte:options runes={true} />

<script lang="ts">
	import { getContext } from 'svelte';
	import { useTheme } from '$lib/components/Theme/theme.state';
	import type { Group, Graph, GroupBox } from '$lib/components/Templates/Canvas/Graph/Graph.types';
	import type { GraphKey, GroupKey } from '$lib/components/Templates/Canvas/Graph/Graph.types';
	import type { UnifiedThemeContext } from '$lib/components/Templates/Canvas/types/theme';
	import type { Direction } from '$lib/components/Templates/Canvas/types/general';
	import GlassPane from '$lib/components/Theme/GlassPane.svelte';
	import AnchorPoint from '$lib/components/Atoms/Anchor/AnchorPoint.svelte';

	interface Props {
		width?: number;
		height?: number;
		position?: { x: number; y: number } | null;
		color?: string;
		groupName?: string;
		label?: string;
		glassPaneOpacity?: number;
		allowNesting?: boolean;
		allowEdges?: boolean;
		anchorPoints?: Direction[];
		anchorLabels?: Record<Direction, string>;
		ongroupdrop?: (event: CustomEvent) => void;
		onedgeconnect?: (event: CustomEvent) => void;
		children?: any;
	}

	const props = $props<Props>();
	const graph = getContext<Graph>('graph');
	const canvasTheme = getContext<UnifiedThemeContext>('theme');
	const { colors, transitions } = useTheme();

	// Use canvas theme for specialized properties, fallback to global theme
	const effectiveColor = $derived(props.color ?? canvasTheme.group.border ?? colors.border);
	const effectiveBackground = $derived(canvasTheme.group.background ?? colors.background);

	// State
	let groupKey = $state<GroupKey>(`${props.groupName || ''}/${graph.id}`);
	let dimensions = $state({
		width: props.width ?? 0,
		height: props.height ?? 0
	});
	let position = $state(props.position);
	let moving = $state(false);
	let isHovered = $state(false);
	let isDragging = $state(false);
	let nestedGroups = $state(new Set<GroupKey>());
	let anchorPoints = $state(new Set<Direction>(props.anchorPoints || []));

	// Derived values
	let glassOpacity = $derived(props.glassPaneOpacity ?? (isHovered ? 0.15 : 0.1));
	let borderWidth = $derived(isHovered ? '3px' : '2px');
	let borderStyle = $derived(isDragging ? 'dashed' : 'solid');

	// Effects
	$effect(() => {
		if (props.width !== undefined) dimensions.width = props.width;
		if (props.height !== undefined) dimensions.height = props.height;
	});

	// Group box with reactive getters
	const groupBox = $state({
		group: groupKey,
		dimensions,
		position,
		color: effectiveColor,
		moving,
		nestedGroups,
		anchorPoints
	});

	// Add to graph context
	$effect(() => {
		graph.groupBoxes.set(groupKey, groupBox);
		graph.groups[groupKey] = {
			parent: groupBox,
			nodes: new Set([groupBox])
		};
	});

	// Event handlers
	function handleGroupDrop(event: CustomEvent) {
		if (!props.allowNesting) return;
		const droppedGroup = event.detail.group;
		nestedGroups.add(droppedGroup);
		updateGroupDimensions();
		props.ongroupdrop?.(event);
	}

	function handleEdgeConnection(event: CustomEvent) {
		if (!props.allowEdges) return;
		const { source, target, direction } = event.detail;
		graph.edges.add({
			source,
			target: groupKey,
			direction,
			label: props.anchorLabels?.[direction]
		});
		props.onedgeconnect?.(event);
	}

	function updateGroupDimensions() {
		let maxWidth = dimensions.width;
		let maxHeight = dimensions.height;

		nestedGroups.forEach(key => {
			const group = graph.groups[key];
			if (group?.parent?.dimensions) {
				const { width, height } = group.parent.dimensions;
				maxWidth = Math.max(maxWidth, width);
				maxHeight = Math.max(maxHeight, height);
			}
		});

		dimensions.width = maxWidth;
		dimensions.height = maxHeight;
	}

	function handleMouseEnter() {
		isHovered = true;
	}

	function handleMouseLeave() {
		isHovered = false;
	}

	function handleMouseDown(event: MouseEvent) {
		isDragging = true;
		event.stopPropagation();
	}

	function handleMouseUp(event: MouseEvent) {
		isDragging = false;
		event.stopPropagation();
	}

	function handleDragStart(event: DragEvent) {
		event.dataTransfer?.setData('group/id', groupKey);
		moving = true;
	}

	function handleDragEnd() {
		moving = false;
	}

	function handleDrop(event: DragEvent) {
		event.preventDefault();
		const droppedGroupId = event.dataTransfer?.getData('group/id');
		if (droppedGroupId) {
			handleGroupDrop(new CustomEvent('groupdrop', {
				detail: { group: droppedGroupId }
			}));
		}
	}

	function handleDragOver(event: DragEvent) {
		event.preventDefault();
		event.dataTransfer!.dropEffect = 'move';
	}
</script>

{#snippet group()}
	<div
		class="group-container"
		style:width="{dimensions.width}px"
		style:height="{dimensions.height}px"
		style:transform="translate({position?.x ?? 0}px, {position?.y ?? 0}px)"
		style:border="{borderWidth} {borderStyle} {effectiveColor}"
		draggable={true}
		onmouseenter={handleMouseEnter}
		onmouseleave={handleMouseLeave}
		onmousedown={handleMouseDown}
		onmouseup={handleMouseUp}
		ondragstart={handleDragStart}
		ondragend={handleDragEnd}
		ondrop={handleDrop}
		ondragover={handleDragOver}
	>
		<GlassPane
			opacity={glassOpacity}
			color={effectiveBackground}
			blur={2}
		/>
		
		{#if props.label}
			<div class="group-label" style:color={canvasTheme.group.text}>
				{props.label}
			</div>
		{/if}

		{#if props.allowEdges}
			{#each [...anchorPoints] as direction}
				<AnchorPoint
					{direction}
					label={props.anchorLabels?.[direction]}
					color={canvasTheme.group.anchor}
					onconnect={handleEdgeConnection}
				/>
			{/each}
		{/if}

		{@render children()}
	</div>
{/snippet}

{#snippet children()}
	{props.children}
{/snippet}

<style>
	.group-container {
		position: relative;
		border-radius: var(--radius-lg);
		transition: var(--transition-normal);
		overflow: visible;
		touch-action: none;
		user-select: none;
	}

	.group-label {
		position: absolute;
		top: -24px;
		left: 8px;
		font-size: 14px;
		font-weight: 500;
		pointer-events: none;
	}
</style>
