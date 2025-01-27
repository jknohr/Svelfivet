<script lang="ts">
    import type { Graph, GroupBox, GroupKey } from '$lib/types';
    import GroupBoundingBox from '$lib/components/Group/GroupBoundingBox.svelte';
    import { getContext } from 'svelte';
    import { derived } from 'svelte/store';

    // Get graph context
    const graph = getContext<Graph>('graph');

    // Reactive state for groupBoxes
    const groupBoxes = derived(graph.groupBoxes, ($groupBoxes) => {
        if ($groupBoxes && typeof $groupBoxes.entries === 'function') {
            return Array.from($groupBoxes.entries()) as [GroupKey, GroupBox][];
        }
        return [];
    });

    // Handle group click and dispatch event
    function handleGroupClick(groupName: string, e: MouseEvent) {
        e.stopPropagation();
        const event = new CustomEvent('groupClick', {
            detail: { groupName },
            bubbles: true
        });
        document.dispatchEvent(event);
    }
</script>

<!-- Group rendering loop -->
{#each $groupBoxes as [id, group] (id)}
    <GroupBoundingBox 
        {...group} 
        groupName={id}
        onclick={(e: MouseEvent) => handleGroupClick(id, e)}
    />
{/each}