<script lang="ts">
	import type { WritableEdge, EdgeStyle, CSSColorString } from '$lib/types';
	import { setContext } from 'svelte';

	interface EdgeAnimationConfig {
		flowAnimation: 'none' | 'forward' | 'backward' | 'bidirectional';
		dotSize?: number;
		dotOpacity?: number;
		dotColor?: CSSColorString | null;
		animationSpeed?: number;  // Speed multiplier for animation
	}

	interface EdgeStyleConfig {
		edgeStyle?: EdgeStyle;
		lineWidth?: number | null;
		color?: CSSColorString | null;
		opacity?: number;
		zOffset?: number;  // Z-index offset for layering
	}

	interface EdgeHierarchyConfig {
		level?: number;  // Hierarchical level
		weight?: number;  // Edge weight for algorithms
		group?: string;   // Grouping identifier
		priority?: number; // Priority for rendering/routing
		parent?: string;  // Parent edge identifier
	}

	interface EdgeActionConfig {
		onClick?: (event: MouseEvent) => void;
		onHover?: (event: MouseEvent) => void;
		onDrag?: (event: MouseEvent) => void;
		interactive?: boolean;
		draggable?: boolean;
		selectable?: boolean;
	}

	interface EdgeEndpointMetadata {
		id: string;
		type?: string;
		dataType?: string;
		format?: string;
		schema?: Record<string, unknown>;
		validation?: {
			required?: boolean;
			min?: number;
			max?: number;
			pattern?: string;
			custom?: (value: unknown) => boolean;
		};
		transform?: (value: unknown) => unknown;
	}

	interface EdgeMetadataConfig {
		id?: string;
		label?: string;
		description?: string;
		tags?: string[];
		// Input/Output metadata
		input?: EdgeEndpointMetadata | EdgeEndpointMetadata[];
		output?: EdgeEndpointMetadata | EdgeEndpointMetadata[];
		// Flow metadata
		flowRate?: number;
		capacity?: number;
		protocol?: string;
		// Timing metadata
		latency?: number;
		updateFrequency?: number;
		lastUpdated?: Date;
		// State metadata
		status?: 'active' | 'inactive' | 'error' | 'pending';
		errorRate?: number;
		healthScore?: number;
		// Version control
		version?: string;
		createdAt?: Date;
		updatedAt?: Date;
		// Custom data
		data?: Record<string, unknown>;
		metrics?: Record<string, number>;
		config?: Record<string, unknown>;
	}

	interface Props {
		edge: WritableEdge;
		children?: import('svelte').Snippet;
		// Style and Animation
		style?: EdgeStyleConfig;
		animation?: EdgeAnimationConfig;
		// Structure and Behavior
		hierarchy?: EdgeHierarchyConfig;
		actions?: EdgeActionConfig;
		// Metadata and Extensions
		metadata?: EdgeMetadataConfig;
		extensions?: Record<string, unknown>;
	}

	let { 
		edge, 
		children,
		style = {
			edgeStyle: 'bezier',
			lineWidth: null,
			color: null,
			opacity: 1,
			zOffset: 0
		},
		animation = {
			flowAnimation: 'none',
			dotSize: 4,
			dotOpacity: 0.75,
			dotColor: null,
			animationSpeed: 1
		},
		hierarchy = {
			level: 0,
			weight: 1,
			group: undefined,
			priority: 0,
			parent: undefined
		},
		actions = {
			interactive: true,
			draggable: false,
			selectable: true
		},
		metadata = {
			status: 'active',
			flowRate: 1,
			healthScore: 1,
			input: {
				id: 'default-input',
				type: 'default',
				validation: { required: true }
			},
			output: {
				id: 'default-output',
				type: 'default'
			}
		},
		extensions = {}
	}: Props = $props();

	// Set contexts
	setContext('edge', edge);
	setContext('edgeStyle', style);
	setContext('edgeAnimation', animation);
	setContext('edgeHierarchy', hierarchy);
	setContext('edgeActions', actions);
	setContext('edgeMetadata', metadata);
	setContext('edgeExtensions', extensions);

	// Compute derived properties
	$effect(() => {
		// Update edge properties directly
		if (metadata) {
			edge.metadata = {
				...edge.metadata,
				...metadata,
				updatedAt: new Date()
			};
		}

		// Update flow animation based on status
		if (metadata.status === 'inactive') {
			animation.flowAnimation = 'none';
		} else if (metadata.status === 'error') {
			animation.dotColor = '#ff0000' as CSSColorString;
		}

		// Update style based on health score
		if (metadata.healthScore !== undefined) {
			style.opacity = Math.max(0.3, metadata.healthScore);
		}
	});
</script>

{@render children?.()}
