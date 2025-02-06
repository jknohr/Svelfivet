<svelte:options runes />

<script lang="ts">
    import { onMount } from 'svelte';
    import Svelvet from '$lib/components/Templates/Canvas/Svelvet/Svelvet.svelte';
    import ActionNode from './ActionNode.svelte';   
    import TransitionEdge from './TransitionEdge.svelte';
    import EditNodeModal from './EditNodeModal.svelte';
    import ContextMenu from './ContextMenu.svelte';
    import { v4 as uuidv4 } from 'uuid';

    interface WorkflowNode {
        id: string;
        type: string;
        name: string;
        x: number;
        y: number;
    }

    type EdgeStyle = 'success' | 'failure';

    interface WorkflowEdge {
        id: string;
        source: string;
        target: string;
        label: string;
        edgeStyle: EdgeStyle;
    }

    const EdgeStyleEnum = {
        Success: 'success' as EdgeStyle,
        Failure: 'failure' as EdgeStyle
    };

    let workflow = $state({
        nodes: [
            { id: uuidv4(), type: 'ApiCall', name: 'Fetch Data', x: 100, y: 100 },
            { id: uuidv4(), type: 'DatabaseQuery', name: 'Query Database', x: 300, y: 100 },
            { id: uuidv4(), type: 'TauriCommand', name: 'Run Tauri Command', x: 500, y: 100 },
            { id: uuidv4(), type: 'LocalCommand', name: 'Execute Local Command', x: 700, y: 100 }
        ],
        edges: [
            { id: uuidv4(), source: 'Fetch Data', target: 'Query Database', label: 'Success', edgeStyle: EdgeStyleEnum.Success },
            { id: uuidv4(), source: 'Fetch Data', target: 'Error Handler', label: 'Error', edgeStyle: EdgeStyleEnum.Failure },
            { id: uuidv4(), source: 'Query Database', target: 'Run Tauri Command', label: 'Success', edgeStyle: EdgeStyleEnum.Success },
            { id: uuidv4(), source: 'Query Database', target: 'Error Handler', label: 'Error', edgeStyle: EdgeStyleEnum.Failure },
            { id: uuidv4(), source: 'Run Tauri Command', target: 'Execute Local Command', label: 'Success', edgeStyle: EdgeStyleEnum.Success },
            { id: uuidv4(), source: 'Run Tauri Command', target: 'Error Handler', label: 'Error', edgeStyle: EdgeStyleEnum.Failure },
            { id: uuidv4(), source: 'Execute Local Command', target: 'End', label: 'Success', edgeStyle: EdgeStyleEnum.Success },
            { id: uuidv4(), source: 'Execute Local Command', target: 'Error Handler', label: 'Error', edgeStyle: EdgeStyleEnum.Failure }
        ]
    });

    let editModalVisible = $state(false);
    let currentNode = $state<WorkflowNode | null>(null);

    function addNode(x: number, y: number) {
        const newNode: WorkflowNode = {
            id: uuidv4(),
            type: 'ApiCall',
            name: 'New Action',
            x,
            y
        };
        workflow.nodes.push(newNode);
    }

    function addEdge(source: string, target: string, label: string, edgeStyle: EdgeStyle = EdgeStyleEnum.Success) {
        const newEdge: WorkflowEdge = {
            id: uuidv4(),
            source,
            target,
            label,
            edgeStyle
        };
        workflow.edges.push(newEdge);
    }

    function deleteNode(nodeId: string) {
        workflow.nodes = workflow.nodes.filter(node => node.id !== nodeId);
        workflow.edges = workflow.edges.filter(edge => 
            edge.source !== nodeId && edge.target !== nodeId
        );
        editModalVisible = false;
    }

    function deleteEdge(edgeId: string) {
        workflow.edges = workflow.edges.filter(edge => edge.id !== edgeId);
    }

    function updateNode(updatedNodeData: { id: string; type: string; name: string; parameters?: string }) {
        const existingNode = workflow.nodes.find(n => n.id === updatedNodeData.id);
        if (existingNode) {
            const updatedNode: WorkflowNode = {
                ...updatedNodeData,
                x: existingNode.x,
                y: existingNode.y
            };
            workflow.nodes = workflow.nodes.map(node => 
                node.id === updatedNode.id ? updatedNode : node
            );
        }
        editModalVisible = false;
    }

    function updateEdge(updatedEdge: WorkflowEdge) {
        const index = workflow.edges.findIndex(edge => edge.id === updatedEdge.id);
        if (index !== -1) {
            workflow.edges[index] = updatedEdge;
        }
    }

    function handleNodeClick(nodeId: string) {
        const node = workflow.nodes.find(n => n.id === nodeId);
        if (node) {
            currentNode = node;
            editModalVisible = true;
        }
    }

    function handleEdgeClick(edgeId: string) {
        const edge = workflow.edges.find(e => e.id === edgeId);
        if (edge) {
            // Implement edge editing logic here
        }
    }
</script>

<div class="workflow-diagram">
    <h1>Workflow Diagram</h1>
    <Svelvet
        nodes={workflow.nodes}
        edges={workflow.edges}
        options={{
            nodeComponent: ActionNode,
            edgeComponent: TransitionEdge,
            pannable: true,
            zoomable: true,
            snapToGrid: true,
            snapGrid: 20,
            theme: 'dark'
        }}
        nodeClick={handleNodeClick}
        edgeClick={handleEdgeClick}
    >
    <ContextMenu 
        addNode={addNode}
        addEdge={addEdge}
    />
    {#if editModalVisible && currentNode}
        <EditNodeModal 
            visible={editModalVisible}
            node={currentNode}
            save={updateNode}
            delete={deleteNode}
            close={() => editModalVisible = false}
        />
    {/if}
    </Svelvet>
</div>

<style>
    .workflow-diagram {
        position: relative;
        padding: 1rem;
        background-color: var(--surface);
    }

    h1 {
        text-align: center;
        margin-bottom: 1rem;
        color: var(--text);
    }
</style>