<!--
@component TreeLayout3D
A 3D tree layout component that creates a tilted perspective view.
Features:
- Tilted backward perspective (25 degrees)
- Automatic node positioning with D3
- Depth-based scaling and positioning
- Glass effect integration
- Smooth transitions
- AR/VR ready
-->
<svelte:options runes={true} />

<script lang="ts">
  import { getContext } from 'svelte';
  import type { UnifiedThemeContext } from '$lib/components/Theme/Theme.types';
  import type { Node } from '$lib/components/Organisms/Node/Node.types';
  import type { Snippet } from 'svelte';
  import { onMount } from 'svelte';
  import { BASE, SPACE_3D } from '$lib/components/Theme/SpatialDesign';
  import * as d3 from 'd3';

  // Props
  interface Props {
    nodes: Node[];
    rootId?: string;
    nodeWidth?: number;
    nodeHeight?: number;
    levelSpacing?: number;
    siblingSpacing?: number;
    tiltAngle?: number;
    depthMultiplier?: number;
    children?: Snippet<[{ node: Node }]>;
  }

  let {
    nodes = [],
    rootId,
    nodeWidth = 200,
    nodeHeight = 150,
    levelSpacing = 300,
    siblingSpacing = 100,
    tiltAngle = 25,
    depthMultiplier = 1.5,
    children
  } = $props();

  // Theme context
  const theme = getContext<UnifiedThemeContext>('theme');

  // Types for D3
  type TreeNodeData = d3.HierarchyPointNode<Node>;
  type TreeLinkData = d3.HierarchyPointLink<Node>;

  // State
  let container: HTMLElement;
  let treeData = $state<TreeNodeData | undefined>();
  let layout = $state<d3.TreeLayout<Node> | undefined>();
  let dimensions = $state({ width: 0, height: 0, depth: 0 });

  // Initialize tree layout
  function initializeTree() {
    if (!nodes.length) return;

    // Find root node
    const root = rootId 
      ? nodes.find((n: Node) => n.id === rootId)
      : nodes[0];

    if (!root) return;

    // Create hierarchy
    const hierarchy = d3.stratify<Node>()
      .id((d: Node) => d.id)
      .parentId((d: Node) => d.parent)
      (nodes);

    // Create tree layout
    layout = d3.tree<Node>()
      .nodeSize([nodeWidth + siblingSpacing, nodeHeight + levelSpacing])
      .separation((a, b) => a.parent === b.parent ? 1 : 1.2);

    // Apply layout
    treeData = layout(hierarchy) as TreeNodeData;

    // Calculate dimensions
    const bounds = treeData.descendants().reduce(
      (acc: { minX: number; maxX: number; minY: number; maxY: number }, node: TreeNodeData) => ({
        minX: Math.min(acc.minX, node.x),
        maxX: Math.max(acc.maxX, node.x),
        minY: Math.min(acc.minY, node.y),
        maxY: Math.max(acc.maxY, node.y)
      }),
      { minX: 0, maxX: 0, minY: 0, maxY: 0 }
    );

    dimensions = {
      width: bounds.maxX - bounds.minX + nodeWidth,
      height: bounds.maxY - bounds.minY + nodeHeight,
      depth: bounds.maxY * Math.sin(tiltAngle * Math.PI / 180) * depthMultiplier
    };
  }

  // Initialize on mount and watch for changes in nodes
  onMount(() => {
    initializeTree();
  });

  $effect(() => {
    initializeTree();
  });

  // Compute node positions with 3D transforms
  function getNodeTransform(node: TreeNodeData) {
    const x = node.x;
    const y = node.y;
    const z = y * Math.sin(tiltAngle * Math.PI / 180) * depthMultiplier;
    const scale = 1 - (z / (dimensions.depth * 2)); // Scale nodes based on depth

    return {
      transform: `
        translate3d(${x}px, ${y * Math.cos(tiltAngle * Math.PI / 180)}px, ${z}px)
        scale(${scale})
        rotateX(${tiltAngle}deg)
      `,
      zIndex: Math.round(z)
    };
  }

  // Compute edge paths with 3D perspective
  function getEdgePath(source: TreeNodeData, target: TreeNodeData) {
    const sourcePos = getNodeTransform(source);
    const targetPos = getNodeTransform(target);
    
    // Create curved path that follows the 3D perspective
    const midX = (source.x + target.x) / 2;
    const midY = (source.y + target.y) / 2;
    const midZ = ((source.y + target.y) / 2) * 
                 Math.sin(tiltAngle * Math.PI / 180) * 
                 depthMultiplier;

    return `
      M ${source.x} ${source.y * Math.cos(tiltAngle * Math.PI / 180)}
      Q ${midX} ${midY * Math.cos(tiltAngle * Math.PI / 180)} 
        ${target.x} ${target.y * Math.cos(tiltAngle * Math.PI / 180)}
    `;
  }
</script>

<div 
  class="tree-layout-3d"
  bind:this={container}
  style="
    --tree-width: {dimensions.width}px;
    --tree-height: {dimensions.height}px;
    --tree-depth: {dimensions.depth}px;
    --tree-perspective: {dimensions.depth * 2}px;
    --tree-tilt: {tiltAngle}deg;
  "
>
  <div class="tree-container">
    {#if treeData}
      <!-- Edges -->
      <svg class="edges">
        {#each treeData.links() as link}
          <path 
            class="edge"
            d={getEdgePath(link.source as TreeNodeData, link.target as TreeNodeData)}
          />
        {/each}
      </svg>

      <!-- Nodes -->
      {#each treeData.descendants() as node}
        {@const transform = getNodeTransform(node as TreeNodeData)}
        <div 
          class="node-wrapper"
          style:transform={transform.transform}
          style:z-index={transform.zIndex}
        >
          {@render children?.({ node: node.data })}
        </div>
      {/each}
    {/if}
  </div>
</div>

<style>
  .tree-layout-3d {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
    perspective: var(--tree-perspective);
    perspective-origin: center center;
  }

  .tree-container {
    position: absolute;
    top: 50%;
    left: 50%;
    width: var(--tree-width);
    height: var(--tree-height);
    transform-style: preserve-3d;
    transform: translate(-50%, -50%);
  }

  .edges {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    transform-style: preserve-3d;
    transform: rotateX(var(--tree-tilt));
  }

  .edge {
    fill: none;
    stroke: var(--color-border);
    stroke-width: 2px;
    opacity: 0.5;
    transition: all var(--transition-normal) var(--ease-standard);
  }

  .node-wrapper {
    position: absolute;
    transform-style: preserve-3d;
    transition: all var(--transition-normal) var(--ease-standard);
    will-change: transform;
  }

  /* Spatial adjustments */
  @media (--ar) {
    .tree-layout-3d {
      transform-style: preserve-3d;
      transform: scale(var(--ar-scale, 1));
    }

    .node-wrapper {
      transform: translateZ(calc(var(--depth-node) * var(--ar-depth-multiplier, 1)));
    }
  }

  @media (--vr) {
    .tree-layout-3d {
      transform-style: preserve-3d;
      transform: scale(var(--vr-scale, 1));
    }

    .node-wrapper {
      transform: translateZ(calc(var(--depth-ui) * var(--vr-depth-multiplier, 1)));
    }
  }
</style> 
