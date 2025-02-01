<script lang="ts">
  import type { Node } from "$lib/types/graph";
  import { SurrealManager } from "$lib/components/Templates/Canvas/db/SurrealManager";
  import type { SerializedNode } from "$lib/types/graph-persistence";

  // Props with TypeScript interface
  interface Props {
    initialNodes?: Node[];
    onnodeSelect?: (nodeId: string) => void;
    onnodeUpdate?: (nodes: Node[]) => void;
  }

  let { initialNodes = [], onnodeSelect, onnodeUpdate } = $props();

  // State management with runes
  let nodes = $state(initialNodes);
  let selectedNodeId = $state<string | null>(null);
  let treeId = $state<string | null>(null);
  let editingNodeId = $state<string | null>(null);

  // Derived values using derived
  let visibleNodes = $derived(
    flatten(nodes)
  );

  function flatten(nodes: Node[], level = 0): Node[] {
    return nodes.flatMap((node: Node) => [
      { ...node, level },
      ...(node.expanded && node.children
        ? flatten(node.children, level + 1)
        : []),
      ...(node.expanded && node.internalTree
        ? flatten(node.internalTree, level + 1)
        : []),
    ]);
  }

  // Node operations
  function toggleExpand(nodeId: string) {
    nodes = nodes.map((node: Node) => {
      if (node.id === nodeId) {
        return { ...node, expanded: !node.expanded };
      }
      return node;
    });
    onnodeUpdate?.(nodes);
  }

  function selectNode(nodeId: string) {
    selectedNodeId = nodeId;
    onnodeSelect?.(nodeId);
  }

  function addNode(parentId: string | null) {
    const newNode: Node = {
      id: `N-${crypto.randomUUID().replace(/-/g, '')}`,
      label: "New Node",
      expanded: false,
      children: [],
      internalTree: [],
      position: { x: 0, y: 0 },
      dimensions: { width: 200, height: 100 },
      moving: false,
      inputs: 0,
      outputs: 0,
      anchors: new Map(),
      group: null,
      collapsed: false,
      resizingWidth: false,
      resizingHeight: false,
      rotating: false,
      editable: true,
      locked: false,
      recalculateAnchors: () => {},
      resizable: true,
      zIndex: 1,
      edge: null,
      direction: 'TD',
      borderRadius: 0,
      borderWidth: 1,
      connections: [],
      bgColor: null,
      borderColor: null,
      selectionColor: null,
      textColor: null,
      rotation: 0
    };

    if (parentId === null) {
      nodes = [...nodes, newNode];
    } else {
      nodes = nodes.map((node: Node) => {
        if (node.id === parentId) {
          return {
            ...node,
            children: [...(node.children || []), newNode],
          };
        }
        return node;
      });
    }
    onnodeUpdate?.(nodes);
  }

  function addInternalTree(nodeId: string) {
    const newNode: Node = {
      id: `N-${crypto.randomUUID().replace(/-/g, '')}`,
      label: "New Internal Node",
      expanded: false,
      children: [],
      internalTree: [],
      position: { x: 0, y: 0 },
      dimensions: { width: 200, height: 100 },
      moving: false,
      inputs: 0,
      outputs: 0,
      anchors: new Map(),
      group: null,
      collapsed: false,
      resizingWidth: false,
      resizingHeight: false,
      rotating: false,
      editable: true,
      locked: false,
      recalculateAnchors: () => {},
      resizable: true,
      zIndex: 1,
      edge: null,
      direction: 'TD',
      borderRadius: 0,
      borderWidth: 1,
      connections: [],
      bgColor: null,
      borderColor: null,
      selectionColor: null,
      textColor: null,
      rotation: 0
    };

    nodes = nodes.map((node) => {
      if (node.id === nodeId) {
        return {
          ...node,
          internalTree: [...(node.internalTree || []), newNode],
        };
      }
      return node;
    });
    onnodeUpdate?.(nodes);
  }

  function deleteNode(nodeId: string) {
    const deleteFromArray = (nodes: Node[]): Node[] => {
      return nodes
        .filter((node) => node.id !== nodeId)
        .map((node) => ({
          ...node,
          children: node.children ? deleteFromArray(node.children) : [],
          internalTree: node.internalTree
            ? deleteFromArray(node.internalTree)
            : [],
        }));
    };

    nodes = deleteFromArray(nodes);
    if (selectedNodeId === nodeId) {
      selectedNodeId = null;
    }
    onnodeUpdate?.(nodes);
  }

  // Database operations
  async function saveTree(type: 'local' | 'surreal', treeId?: string) {
    const treeSnapshot = {
      nodes: nodes.map(node => ({
        id: node.id,
        label: node.label,
        children: node.children
      })),
      version: '1.0'
    };

    if (type === 'surreal') {
      const db = await SurrealManager.connect();
      // Check if we're updating an existing tree or creating a new one
      if (treeId) {
        await db.query('UPDATE $treeId SET data = $data', {
          treeId,
          data: treeSnapshot
        });
      } else {
        // Create a new tree
        await db.query('CREATE tree SET data = $data', {
          data: treeSnapshot
        });
      }
    } else {
      // Local storage
      localStorage.setItem('tree', JSON.stringify(treeSnapshot));
    }
  }

  async function loadTree(id: string) {
    try {
      await SurrealManager.transaction(async (db) => {
        treeId = id;

        // Get all nodes in the tree with their relationships
        const result = await db.query(
          `
          SELECT 
            id,
            label,
            metadata,
            ->has_child->{
              id: out,
              edge: {
                position,
                dimensions,
                expanded,
                level,
                order
              }
            } AS children,
            ->has_internal->{
              id: out,
              edge: {
                position,
                dimensions,
                expanded,
                level,
                order
              }
            } AS internalTree
          FROM node 
          WHERE id IN (
            SELECT ->has_root->node.id FROM tree 
            WHERE id = $id
          );
        `,
          { id }
        );

        if (result[0]) {
          // Reconstruct tree structure
          const nodeMap = new Map<string, Node>();
          const rootNodes: Node[] = [];

          // First pass: create all nodes with their metadata
          result[0].forEach((nodeData: any) => {
            const node: Node = {
              id: nodeData.id,
              label: nodeData.label,
              ...nodeData.metadata,
              position: nodeData.edge?.position ?? { x: 0, y: 0 },
              dimensions: nodeData.edge?.dimensions ?? {
                width: 200,
                height: 100,
              },
              expanded: nodeData.edge?.expanded ?? false,
              level: nodeData.edge?.level ?? 0,
              children: [],
              internalTree: [],
            };
            nodeMap.set(node.id, node);
          });

          // Second pass: build relationships
          result[0].forEach((nodeData: any) => {
            const node = nodeMap.get(nodeData.id);
            if (!node) return;

            if (nodeData.children) {
              node.children = nodeData.children
                .sort(
                  (a: any, b: any) => (a.edge.order ?? 0) - (b.edge.order ?? 0)
                )
                .map((child: any) => ({
                  ...nodeMap.get(child.id)!,
                  position: child.edge.position,
                  dimensions: child.edge.dimensions,
                  expanded: child.edge.expanded,
                  level: child.edge.level,
                }));
            }

            if (nodeData.internalTree) {
              node.internalTree = nodeData.internalTree
                .sort(
                  (a: any, b: any) => (a.edge.order ?? 0) - (b.edge.order ?? 0)
                )
                .map((internal: any) => ({
                  ...nodeMap.get(internal.id)!,
                  position: internal.edge.position,
                  dimensions: internal.edge.dimensions,
                  expanded: internal.edge.expanded,
                  level: internal.edge.level,
                }));
            }

            // If no incoming has_child relationship, it's a root node
            if (!nodeData.parentId) {
              rootNodes.push(node);
            }
          });

          nodes = rootNodes;
          onnodeUpdate?.(nodes);
        }
      });
    } catch (error) {
      console.error("Failed to load tree:", error);
      throw error;
    }
  }

  // Effects
  $effect(() => {
    if (treeId) {
      loadTree(treeId).catch(console.error);
    }
  });
</script>

<div class="tree" role="tree">
  <div class="tree-actions">
    <div class="save-options">
      <button class="action-button" onclick={() => saveTree("surreal")}>
        Save to SurrealDB
      </button>
      <button class="action-button" onclick={() => saveTree("local")}>
        Export JSON
      </button>
    </div>
    <input
      type="text"
      placeholder="Tree ID"
      bind:value={treeId}
      class="tree-id-input"
    />
    <button
      class="action-button"
      onclick={() => treeId && loadTree(treeId)}
      disabled={!treeId}
    >
      Load Tree
    </button>
  </div>

  {#if visibleNodes.length}
    {#each visibleNodes as node (node.id)}
      <div
        class="node"
        style:padding-left="{(node.level || 0) * 20}px"
        class:selected={node.id === selectedNodeId}
        onclick={() => selectNode(node.id)}
        role="treeitem"
        aria-selected={node.id === selectedNodeId}
        tabindex="0"
        onkeydown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            selectNode(node.id);
          }
        }}
      >
        <button
          class="toggle"
          onclick={(e) => {
            e.stopPropagation();
            toggleExpand(node.id);
          }}
        >
          {(node.children?.length || 0) + (node.internalTree?.length || 0) > 0
            ? node.expanded
              ? "▼"
              : "▶"
            : "•"}
        </button>

        <span class="label">{node.label}</span>

        <div class="actions">
          <button onclick={(e) => {
            e.stopPropagation();
            addNode(node.id);
          }}>Add Child</button>
          <button onclick={(e) => {
            e.stopPropagation();
            addInternalTree(node.id);
          }}>Add Internal</button>
          <button onclick={(e) => {
            e.stopPropagation();
            deleteNode(node.id);
          }}>Delete</button>
        </div>
      </div>
    {/each}
  {:else}
    <p class="empty-state">No nodes yet. Add a root node to get started.</p>
  {/if}

  <button class="add-root" onclick={() => addNode(null)}>
    Add Root Node
  </button>
</div>

<style>
  .tree {
    padding: 1rem;
  }

  .tree-actions {
    margin-bottom: 1rem;
    display: flex;
    gap: 0.5rem;
  }

  .node {
    display: flex;
    align-items: center;
    padding: 0.5rem;
    margin: 0.25rem 0;
    border: 1px solid #ddd;
    border-radius: 4px;
  }

  .node.selected {
    background-color: #e3f2fd;
  }

  .toggle {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0 0.5rem;
  }

  .label {
    flex: 1;
    cursor: pointer;
    padding: 0 0.5rem;
  }

  .actions {
    display: flex;
    gap: 0.5rem;
  }

  button {
    padding: 0.25rem 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    background-color: white;
    cursor: pointer;
  }

  button:hover {
    background-color: #f5f5f5;
  }

  .add-root {
    margin-top: 1rem;
  }

  .tree-id-input {
    padding: 0.25rem 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
</style>
