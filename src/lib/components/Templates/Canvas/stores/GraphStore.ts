import type { Graph, GraphKey, Node, Edge, GroupBox, NodeKey, EdgeKey, GroupKey, XYPair } from '../types/logic';
import type { ReactiveState } from '../types/stores';

export interface GraphState {
    scale: number;
    translation: XYPair;
    selectedNodes: Set<NodeKey>;
    selectedEdges: Set<EdgeKey>;
    selectedGroups: Set<GroupKey>;
    isDragging: boolean;
    isPanning: boolean;
}

export class GraphStoreImpl implements ReactiveState<Graph> {
    private _graph = $state<Graph | null>(null);
    private _state = $state<GraphState>({
        scale: 1,
        translation: { x: 0, y: 0 },
        selectedNodes: new Set(),
        selectedEdges: new Set(),
        selectedGroups: new Set(),
        isDragging: false,
        isPanning: false
    });

    constructor(initialGraph?: Graph) {
        if (initialGraph) {
            this._graph = initialGraph;
        }
    }

    get value(): Graph {
        if (!this._graph) {
            throw new Error('Graph is not initialized');
        }
        return this._graph;
    }

    get state(): GraphState {
        return this._state;
    }

    set(graph: Graph) {
        this._graph = graph;
    }

    update(fn: (graph: Graph) => Graph) {
        this.set(fn(this.value));
    }

    // Graph operations
    addNode(key: NodeKey, node: Node) {
        this.value.nodes.set(key, node);
    }

    removeNode(key: NodeKey) {
        this.value.nodes.delete(key);
    }

    addEdge(key: EdgeKey, edge: Edge) {
        this.value.edges.set(key, edge);
    }

    removeEdge(key: EdgeKey) {
        this.value.edges.delete(key);
    }

    addGroup(key: GroupKey, group: GroupBox) {
        this.value.groups.set(key, group);
    }

    removeGroup(key: GroupKey) {
        this.value.groups.delete(key);
    }

    // State operations
    updateScale(scale: number) {
        this._state.scale = scale;
        if (this._graph) {
            this._graph.transforms.scale = scale;
        }
    }

    updateTranslation(translation: XYPair) {
        this._state.translation = translation;
        if (this._graph) {
            this._graph.transforms.translation = translation;
        }
    }

    selectNode(key: NodeKey) {
        this._state.selectedNodes.add(key);
    }

    deselectNode(key: NodeKey) {
        this._state.selectedNodes.delete(key);
    }

    selectEdge(key: EdgeKey) {
        this._state.selectedEdges.add(key);
    }

    deselectEdge(key: EdgeKey) {
        this._state.selectedEdges.delete(key);
    }

    selectGroup(key: GroupKey) {
        this._state.selectedGroups.add(key);
    }

    deselectGroup(key: GroupKey) {
        this._state.selectedGroups.delete(key);
    }

    setDragging(isDragging: boolean) {
        this._state.isDragging = isDragging;
    }

    setPanning(isPanning: boolean) {
        this._state.isPanning = isPanning;
    }

    clearSelection() {
        this._state.selectedNodes.clear();
        this._state.selectedEdges.clear();
        this._state.selectedGroups.clear();
    }
}
