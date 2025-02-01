import type { Node, XYPair } from '$lib/components/Templates/Canvas/types';

// Selection state
let selectedNodes = $state(new Set<Node>());
let selectionBox = $state<{ start: XYPair; end: XYPair } | null>(null);

// Derived states
let isSelecting = $derived(!!selectionBox);
let hasSelection = $derived(selectedNodes.size > 0);

const isDevelopment = true; // This can be replaced with your preferred method of environment detection

// Selection management
function selectNode(node: Node) {
    selectedNodes.add(node);
}

function deselectNode(node: Node) {
    selectedNodes.delete(node);
}

function clearSelection() {
    selectedNodes.clear();
    selectionBox = null;
}

function startSelection(position: XYPair) {
    selectionBox = { start: position, end: position };
}

function updateSelection(position: XYPair) {
    if (selectionBox) {
        selectionBox = { ...selectionBox, end: position };
    }
}

function endSelection() {
    selectionBox = null;
}

// Development mode inspection
if (isDevelopment) {
    $effect.pre(() => {
        $inspect(selectedNodes, 'Selected Nodes');
        $inspect(selectionBox, 'Selection Box');
    });
}

export {
    selectedNodes,
    selectionBox,
    isSelecting,
    hasSelection,
    selectNode,
    deselectNode,
    clearSelection,
    startSelection,
    updateSelection,
    endSelection
}; 