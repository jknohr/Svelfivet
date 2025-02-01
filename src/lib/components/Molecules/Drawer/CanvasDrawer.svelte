<script lang="ts">
	import { Node, Svelvet, Anchor, Edge } from '$lib';
	import type { NodeProps } from '$lib/components/Organisms/Node/Node.types';
	import type { AnchorProps } from '$lib/components/Atoms/Anchor/Anchor.types';
	import type { EdgeProps } from '$lib/components/Organisms/Edge/Edge.types';
	import type { NodeConfig, XYPair, EdgeStyle } from '$lib/types';
	import type { NodeDrawerConfig } from './CanvasDrawer.types';
	import DrawerNode from './CanvasDrawerNode.svelte';

	interface Props {
		children?: any;
		onnodeRequest?: () => void;
		width?: number;
		height?: number;
		minimap?: any;
		translation?: any;
		controls?: any;
		edge?: any;
		edgeStyle?: EdgeStyle;
		snapTo?: number;
		editable?: boolean;
		fitView?: boolean;
		locked?: boolean;
		zoom?: number;
		theme?: string;
		mermaid?: string;
		mermaidConfig?: Record<string, any>;
		TD?: boolean;
		disableSelection?: boolean;
		raiseEdgesOnSelect?: boolean;
		modifier?: string;
		trackpadPan?: boolean;
		toggle?: any;
		position?: string;
	}

	let props = $props();

	let width = $state<number | undefined>(undefined);
	let height = $state<number | undefined>(undefined);
	let minimap = $state<any>(undefined);
	let translation = $state<any>(undefined);
	let controls = $state<any>(undefined);
	let edge = $state<any>(undefined);
	let edgeStyle = $state<EdgeStyle | undefined>(undefined);
	let snapTo = $state(0);
	let editable = $state(false);
	let fitView = $state(false);
	let locked = $state(false);
	let zoom = $state(0);
	let theme = $state('');
	let mermaid = $state('');
	let mermaidConfig = $state({});
	let TD = $state(false);
	let disableSelection = $state(false);
	let raiseEdgesOnSelect = $state(false);
	let modifier = $state('');
	let trackpadPan = $state(false);
	let toggle = $state<any>(undefined);
	let position = $state('');
	let childrenContent = $state<any>(undefined);

	// DOM References as state
	let nav = $state<HTMLDivElement | null>(null);
	let drawerBtn = $state<HTMLButtonElement | null>(null);
	let nodeBtn = $state<HTMLButtonElement | null>(null);
	let edgeBtn = $state<HTMLButtonElement | null>(null);
	let anchorBtn = $state<HTMLButtonElement | null>(null);
	let drawerContents = $state<HTMLUListElement | null>(null);
	let nodeContainer = $state<HTMLDivElement | null>(null);
	let anchorContainer = $state<HTMLDivElement | null>(null);
	let edgeContainer = $state<HTMLDivElement | null>(null);

	let svelvetProps = $derived({
		width,
		height,
		minimap,
		translation,
		controls,
		edge,
		edgeStyle,
		snapTo,
		editable,
		fitView,
		locked,
		zoom,
		theme,
		mermaid,
		mermaidConfig,
		TD,
		disableSelection,
		raiseEdgesOnSelect,
		modifier,
		trackpadPan,
		toggle,
		position,
		drawer: true
	});
	let defaultNodes = $state<NodeDrawerConfig[]>([{
		id: 'default-node',
		dimensions: { width: 100, height: 50 },
		borderRadius: 4,
		borderWidth: 1,
		drop: 'cursor'
	}]);
	let dropped_in = $state(false);

	const handleDragEnter = (): void => {
		if (!dropped_in) dropped_in = true;
	};

	const handleDragLeave = (): void => {
		dropped_in = false;
	};

	const onDragOver = (e: DragEvent): void => {
		e.preventDefault();
	};

	const handleDrop = (e: MouseEvent): void => {
		try {
			e.stopPropagation();
			const moveEvent = new MouseEvent('mousemove', {
				clientX: e.clientX,
				clientY: e.clientY,
				bubbles: true
			});
			if (e.target instanceof EventTarget) {
				e.target.dispatchEvent(moveEvent);
			}

			props.onnodeRequest?.();
		} catch (error) {
			console.error('Error handling drop event:', error);
		}
	};
</script>

<div
	role="presentation"
	class="drop_zone"
	onmouseenter={handleDragEnter}
	onmouseleave={handleDragLeave}
	ondragover={onDragOver}
	onmouseup={handleDrop}
	style:width={width ? width + 'px' : '100%'}
	style:height={height ? height + 'px' : '100%'}
	style:position={position ? position : 'relative'}
>
	<Svelvet {...svelvetProps}>
		{#each defaultNodes as { anchors, edgeProps, ...nodeProps }}
			{#if anchors}
				<Node {...nodeProps}>
					{#if anchors.left}
						{#each anchors.left as anchorConfig}
							<Anchor {...anchorConfig} />
							{#if edgeProps}
								<Edge {...edgeProps} />
							{/if}
						{/each}
					{/if}
					{#if anchors.right}
						{#each anchors.right as anchorConfig}
							<Anchor {...anchorConfig} />
							{#if edgeProps}
								<Edge {...edgeProps} />
							{/if}
						{/each}
					{/if}
					{#if anchors.top}
						{#each anchors.top as anchorConfig}
							<Anchor {...anchorConfig} />
							{#if edgeProps}
								<Edge {...edgeProps} />
							{/if}
						{/each}
					{/if}
					{#if anchors.bottom}
						{#each anchors.bottom as anchorConfig}
							<Anchor {...anchorConfig} />
							{#if edgeProps}
								<Edge {...edgeProps} />
							{/if}
						{/each}
					{/if}
					{#if anchors.self}
						{#each anchors.self as anchorConfig}
							<Anchor {...anchorConfig} />
							{#if edgeProps}
								<Edge {...edgeProps} />
							{/if}
						{/each}
					{/if}
				</Node>
			{:else}
				<Node {...nodeProps} />
			{/if}
		{/each}

		{@render childrenContent?.()}
		{@render minimap?.()}
		{@render controls?.()}
		{@render toggle?.()}
	</Svelvet>
</div>
