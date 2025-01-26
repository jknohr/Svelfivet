<script lang="ts">
  import { getContext } from 'svelte';
  import MiniNode from './MiniNode.svelte';
  import MiniGroupBox from './MiniGroupBox.svelte';
  import type { CSSColorString, Graph, Corner } from '$lib/types';
  import type { Node } from '$lib/types';
  import { calculateRelativeCursor } from '$lib/utils';

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
  } = $props<Props>();

  $state = {
    graph,
    bounds: graph.bounds.graphBounds,
    nodes: graph.nodes,
    groups: graph.groups,
    transforms: graph.transforms,
    dimensions: graph.dimensions,
    hidden: graph.groups.hidden.nodes,
    scale: graph.transforms.scale,
    translation: graph.transforms.translation,
    groupBoxes: graph.groupBoxes,
    e: { clientX: 0, clientY: 0 }
  };

  const buffer = 0.9;
  const maxWidth = width * buffer;
  const maxHeight = height * buffer;

  function toggleHidden(node: Node) {
    try {
      if ($state.hidden.has(node)) {
        $state.hidden.delete(node);
      } else {
        $state.hidden.add(node);
      }
      $state.hidden = $state.hidden;
    } catch (error) {
      console.error('Error toggling node visibility:', error);
    }
  }

  // Derived calculations
  $derived bounds = $state.bounds;
  $derived boundsWidth = bounds.right - bounds.left;
  $derived boundsHeight = bounds.bottom - bounds.top;
  $derived boundsRatio = boundsWidth / boundsHeight;
  $derived minimapRatio = width / height;
  $derived landscape = boundsRatio >= minimapRatio;
  $derived boundsScale = landscape ? maxWidth / boundsWidth : maxHeight / boundsHeight;
  $derived scaledBoundsWidth = boundsWidth * boundsScale;
  $derived scaledBoundsHeight = boundsHeight * boundsScale;
</script>

{#snippet renderNode(node, id)}
  {#if node.id !== 'N-editor'}
    <MiniNode
      {node}
      top={bounds.top}
      left={bounds.left}
      nodeColor={nodeColor}
      hidden={$state.hidden.has(node)}
      {toggleHidden}
      {hideable}
    />
  {/if}
{/snippet}

{#snippet renderGroupBox(group, id)}
  <MiniGroupBox 
    {...group} 
    top={bounds.top}
    left={bounds.left}
    groupName={id} 
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
    {#each Array.from($state.nodes.entries()) as [id, node] (id)}
      {@render renderNode(node, id)}
    {/each}

    {#each Array.from($state.groupBoxes.entries()) as [id, group] (id)}
      {@render renderGroupBox(group, id)}
    {/each}
  </div>

  <div class="overlay" style={windowStyle} />
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
