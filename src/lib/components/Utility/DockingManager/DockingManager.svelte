<script lang="ts">
    interface DockPosition {
        x: number;
        y: number;
        width: number;
        height: number;
    }

    interface DockZone {
        id: string;
        position: DockPosition;
        isOccupied: boolean;
    }

    interface Props {
        zones?: DockZone[];
        snapThreshold?: number;
        children?: any;
    }

    let props = $props();
    let { zones = [], snapThreshold = 20 } = props;

    let container = $state<HTMLElement | null>(null);
    let isDragging = $state(false);
    let draggedElement = $state<HTMLElement | null>(null);
    let dragOffset = $state({ x: 0, y: 0 });
    let currentPosition = $state({ x: 0, y: 0 });
    let activeZone = $state<DockZone | null>(null);

    function handleDragStart(event: MouseEvent, element: HTMLElement) {
        isDragging = true;
        draggedElement = element;
        
        const rect = element.getBoundingClientRect();
        dragOffset = {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
        
        document.addEventListener('mousemove', handleDragMove);
        document.addEventListener('mouseup', handleDragEnd);
    }

    function handleDragMove(event: MouseEvent) {
        if (!isDragging || !container || !draggedElement) return;

        const containerRect = container.getBoundingClientRect();
        const x = event.clientX - containerRect.left - dragOffset.x;
        const y = event.clientY - containerRect.top - dragOffset.y;

        currentPosition = { x, y };

        // Find closest dock zone
        const closestZone = findClosestZone(x, y);
        if (closestZone && !closestZone.isOccupied) {
            activeZone = closestZone;
        } else {
            activeZone = null;
        }
    }

    function handleDragEnd() {
        if (activeZone && draggedElement) {
            snapToZone(activeZone);
        }

        isDragging = false;
        draggedElement = null;
        activeZone = null;

        document.removeEventListener('mousemove', handleDragMove);
        document.removeEventListener('mouseup', handleDragEnd);
    }

    function findClosestZone(x: number, y: number): DockZone | null {
        let closest: DockZone | null = null;
        let minDistance = Infinity;

        for (const zone of zones) {
            const dx = x - zone.position.x;
            const dy = y - zone.position.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < snapThreshold && distance < minDistance) {
                minDistance = distance;
                closest = zone;
            }
        }

        return closest;
    }

    function snapToZone(zone: DockZone) {
        if (!draggedElement) return;

        const event = new CustomEvent('dock', {
            detail: {
                element: draggedElement,
                zone: zone
            }
        });
        container?.dispatchEvent(event);
    }
</script>

<div
    class="docking-container"
    bind:this={container}
    style:position="relative"
>
    {#each zones as zone (zone.id)}
        <div
            class="dock-zone"
            class:active={activeZone?.id === zone.id}
            class:occupied={zone.isOccupied}
            style:left="{zone.position.x}px"
            style:top="{zone.position.y}px"
            style:width="{zone.position.width}px"
            style:height="{zone.position.height}px"
        ></div>
    {/each}

    {@render props.children?.({ handleDragStart })}
</div>

<style>
    .docking-container {
        width: 100%;
        height: 100%;
        min-height: 200px;
    }

    .dock-zone {
        position: absolute;
        border: 2px dashed var(--border);
        border-radius: var(--radius-1);
        opacity: 0.3;
        pointer-events: none;
        transition: opacity 0.2s ease;
    }

    .dock-zone.active {
        opacity: 0.8;
        border-color: var(--brand);
    }

    .dock-zone.occupied {
        opacity: 0.1;
        border-style: solid;
    }
</style> 
