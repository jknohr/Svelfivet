<svelte:options runes={true} />

<script lang="ts">
  import { getContext } from 'svelte';
  import MiniNode from './MiniNode.svelte';
  import MiniGroupBox from './MiniGroupBox.svelte';
  import type { CSSColorString, Corner, GroupBox } from '$lib/types';
  import type { Graph, Groups, NodeKey, GroupKey } from '$lib/types/graph';
  import type { Node } from '$lib/types';
  import type { Store } from '$lib/types/store';
  import { calculateRelativeCursor } from '$lib/utils';

  interface GraphState {
    bounds: { top: number; left: number; right: number; bottom: number };
    nodes: Store<Node, NodeKey>;
    groups: Groups & {
      hidden?: {
        nodes: Set<Node | GroupBox>;
      };
    };
    transforms: { scale: number; translation: { x: number; y: number } };
    dimensions: any;
    hidden: Set<Node | GroupBox>;
    scale: number;
    translation: { x: number; y: number };
    groupBoxes: Store<GroupBox, GroupKey>;
    e: { clientX: number; clientY: number };
  }

  const graph = getContext<Graph>('graph');

  interface Props {
    width?: number;
    height?: number;
    mapColor?: CSSColorString;
    nodeColor?: CSSColorString;
    borderColor?: CSSColorString;
    corner?: Corner;
    hideable?: boolean;
  }

  let { 
    width = 100,
    height = width,
    mapColor = null,
    nodeColor = null,
    borderColor = null,
    corner = 'SE',
    hideable = false
  } = $props();

  let graphState = $state<GraphState>({
    bounds: graph.bounds.graphBounds,
    nodes: graph.nodes,
    groups: graph.groups,
    transforms: graph.transforms,
    dimensions: graph.dimensions,
    hidden: new Set(),
    scale: graph.transforms.scale,
    translation: graph.transforms.translation,
    groupBoxes: graph.groupBoxes,
    e: { clientX: 0, clientY: 0 }
  });

  function toggleHidden(node: Node) {
    try {
      if (graphState.hidden.has(node)) {
        graphState.hidden.delete(node);
      } else {
        graphState.hidden.add(node);
      }
      graphState = { ...graphState };
    } catch (error) {
      console.error('Error toggling node visibility:', error);
    }
  }

  const buffer = $state(0.9);
  const maxWidth = $derived(width * buffer);
  const maxHeight = $derived(height * buffer);

  const bounds = $derived(graphState.bounds);
  const boundsWidth = $derived(bounds.right - bounds.left);
  const boundsHeight = $derived(bounds.bottom - bounds.top);
  const boundsRatio = $derived(boundsWidth / boundsHeight);
  const minimapRatio = $derived(width / height);
  const landscape = $derived(boundsRatio >= minimapRatio);
  const boundsScale = $derived(landscape ? maxWidth / boundsWidth : maxHeight / boundsHeight);
  const scaledBoundsWidth = $derived(boundsWidth * boundsScale);
  const scaledBoundsHeight = $derived(boundsHeight * boundsScale);

  const windowStyle = $derived(`
    width: ${scaledBoundsWidth}px;
    height: ${scaledBoundsHeight}px;
    transform: scale(${boundsScale});
  `);
</script>

{#snippet renderNode(node: Node, id: string)}
  {#if node.id !== 'N-editor'}
    <MiniNode
      {node}
      top={bounds.top}
      left={bounds.left}
      {nodeColor}
      hidden={graphState.hidden.has(node)}
      {toggleHidden}
      {hideable}
    />
  {/if}
{/snippet}

{#snippet renderGroupBox(group: GroupBox, id: string)}
  <MiniGroupBox 
    dimensions={group.dimensions}
    position={group.position}
    color={group.color}
    groupName={id}
    top={bounds.top}
    left={bounds.left}
  />
{/snippet}

<div
  class="minimap-wrapper"
  style:width="{width}px"
  style:height="{height}px"
  style:--prop-minimap-border-color={borderColor}
  style:--prop-minimap-background-color={mapColor}
  class:SW={corner === 'SW'}
  class:NE={corner === 'NE'}
  class:SE={corner === 'SE'}
  class:NW={corner === 'NW'}
>
  <div
    class="node-wrapper"
    style:width="{boundsWidth}px"
    style:height="{boundsHeight}px"
    style:transform="scale({boundsScale})"
  >
    {#each graphState.nodes.getAll() as node (node.id)}
      {@render renderNode(node, node.id)}
    {/each}

    {#each graphState.groupBoxes.getAll() as group (group.group)}
      {@render renderGroupBox(group, group.group)}
    {/each}
  </div>

  <div class="overlay" style={windowStyle}></div>
</div>

<style>
  * {
    box-sizing: border-box;
  }
  .minimap-wrapper {
    position: absolute;
    border-radius: 6px;
    overflow: hidden;
    box-shadow: var(--minimap-shadow, var(--default-minimap-shadow));
    border: solid 1px;
    z-index: 10;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(
      --prop-minimap-background-color,
      var(
        --minimap-background-color,
        var(--background-color, var(--default-minimap-background-color))
      )
    );
    border-color: var(
      --prop-minimap-border-color,
      var(--minimap-border, var(--default-minimap-border))
    );
  }

  .NW {
    left: 10px;
    top: 10px;
  }

  .NE {
    right: 10px;
    top: 10px;
  }

  .SE {
    right: 10px;
    bottom: 10px;
  }

  .SW {
    left: 10px;
    bottom: 10px;
  }
  .overlay {
    position: absolute;
    background-color: transparent;
    outline: 400px rgba(0, 0, 0, 0.25) solid;
    box-sizing: border-box;
    pointer-events: none;
  }
  .node-wrapper {
    position: absolute;
  }
</style>
