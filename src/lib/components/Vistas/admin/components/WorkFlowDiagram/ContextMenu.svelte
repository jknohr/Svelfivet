<svelte:options runes />

<script lang="ts">
    let props = $props<{
        addNode: (x: number, y: number) => void;
        addEdge: (source: string, target: string, label: string) => void;
    }>();

    let menuVisible = $state(false);
    let menuX = $state(0);
    let menuY = $state(0);

    function handleContextMenu(event: MouseEvent) {
        event.preventDefault();
        menuX = event.clientX;
        menuY = event.clientY;
        menuVisible = true;
    }

    function handleAddNode() {
        props.addNode(menuX, menuY);
        menuVisible = false;
    }

    function handleAddEdge() {
        // You'll need to implement UI to get these values from the user
        // For now, using placeholder values
        props.addEdge("sourceNode", "targetNode", "transition");
        menuVisible = false;
    }

    function handleClickOutside(event: MouseEvent) {
        if (menuVisible) {
            menuVisible = false;
        }
    }
</script>

<svelte:window oncontextmenu={handleContextMenu} onclick={handleClickOutside} />

{#if menuVisible}
    <div 
        class="context-menu"
        style="left: {menuX}px; top: {menuY}px;"
    >
        <button onclick={handleAddNode}>Add Node</button>
        <button onclick={handleAddEdge}>Add Edge</button>
    </div>
{/if}

<style>
    .context-menu {
        position: fixed;
        background: white;
        border: 1px solid #ccc;
        border-radius: 4px;
        padding: 8px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        z-index: 1000;
    }

    button {
        display: block;
        width: 100%;
        padding: 8px;
        margin: 4px 0;
        border: none;
        background: none;
        cursor: pointer;
        text-align: left;
    }

    button:hover {
        background: #f0f0f0;
    }
</style>
