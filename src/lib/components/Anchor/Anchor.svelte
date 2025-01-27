<script lang="ts">
    import DefaultAnchor from './DefaultAnchor.svelte';
    import Edge from '$lib/components/Edge/Edge.svelte';
    import EdgeContext from '$lib/components/Edge/EdgeContext.svelte';
    import { getContext } from 'svelte';
    import { createEdge, createAnchor, createCursorEdge } from '$lib/utils/creators';
    import type {
        Graph,
        Node,
        Connections,
        CSSColorString,
        EdgeStyle,
        EndStyle,
        EdgeConfig,
        Anchor,
        Direction,
        AnchorKey,
        CustomWritable,
        AnchorConnectionEvent,
        InputType,
        NodeKey,
        OutputStore,
        InputStore,
        ConnectingFrom,
        AnchorStore
    } from '$lib/types';

    // Props with proper typing
    interface Props {
        bgColor?: CSSColorString | null;
        id?: string | number;
        input?: boolean;
        output?: boolean;
        multiple?: boolean;
        dynamic?: boolean;
        edge?: any;
        inputsStore?: Record<string, unknown> | null;
        key?: string | number | null;
        outputStore?: Record<string, unknown> | null;
        connections?: Connections;
        edgeLabel?: string;
        locked?: boolean;
        nodeConnect?: boolean;
        edgeStyle?: EdgeStyle | null;
        endStyles?: [EndStyle | null, EndStyle | null];
        invisible?: boolean;
        direction?: Direction;
        title?: string;
    }

    interface DefaultAnchorProps {
        bgColor: CSSColorString | null;
        output: boolean;
        input: boolean;
        connecting: boolean;
        connected: boolean;
        hovering: boolean;
    }

    let { 
        bgColor = null,
        id = 0,
        input = false,
        output = false,
        multiple = output ? true : input ? false : true,
        dynamic = false,
        edge = null,
        inputsStore = null,
        key = null,
        outputStore = null,
        connections = [],
        edgeLabel = '',
        locked = false,
        nodeConnect = false,
        edgeStyle = null,
        endStyles = [null, null],
        invisible = false,
        direction = 'east',
        title = ''
    }: Props = $props();

    let storeState = $state<Record<string, unknown>>(inputsStore || outputStore || {});

    // Context values
    const nodeDynamic = getContext<boolean>('dynamic');
    const node = getContext<Node>('node');
    const edgeStore = getContext<Graph['edges']>('edgeStore');
    const cursorAnchor = getContext<Anchor>('cursorAnchor');
    const graphDirection = getContext<string>('direction');
    const graph = getContext<Graph>('graph');
    const nodeStore = getContext<Graph['nodes']>('nodeStore');
    const graphEdge = getContext('graphEdge');

    // State management
    let animationFrameId = $state<number>(0);
    let connectingFrom = $state<ConnectingFrom | null>(null);
    let connecting = $state(false);
    let hovering = $state(false);
    let tracking = $state(false);
    let previousConnectionCount = $state(0);
    let anchorElement = $state<HTMLDivElement | null>(null);
    let edgeColor = $state<CSSColorString | null>(null);
    let assignedConnections = $state<Connections>([]);
    let mounted = $state(0);
    let anchorsMounted = $state(0);
    let nodeConnectEvent = $state<null | MouseEvent>(null);

    // Calculate type directly
    const type: InputType = input === output ? null : input ? 'input' : 'output';

    // Initialize anchor
    const anchorKey: AnchorKey = `A-${id || node.anchors.count() + 1}/${node.id}`;
    const anchor = createAnchor(
        graph,
        node,
        anchorKey,
        { x: 0, y: 0 },
        { width: 0, height: 0 },
        storeState,
        edge || node.edge || graphEdge || null,
        type,
        direction || (graphDirection === 'TD' ? (input ? 'north' : 'south') : input ? 'west' : 'east'),
        dynamic || nodeDynamic || false,
        key
    );
    node.anchors.add(anchor, anchor.id);

    // Effects
    $effect(() => {
        if (anchorElement) {
            anchor.recalculatePosition();
        }
    });

    $effect(() => {
        if (!anchorElement) return;
        
        return () => {
            destroy();
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        };
    });

    $effect(() => {
        if (!anchorElement) return;
        
        anchor.recalculatePosition();

        if (node.connections?.length && !input) {
            const remainingConnections: Connections = [];
            let first: number | null = null;
            
            node.connections.forEach((connection, i) => {
                if (!connection) return;
                if (first === null) first = i;

                const outputCount = Array.from(node.anchors as unknown as Map<string, Anchor>)
                    .filter(([_, a]) => a.type === 'output')
                    .length;

                if ((i - first) % outputCount === 0) {
                    assignedConnections = [...assignedConnections, connection];
                    remainingConnections.push(null);
                } else {
                    remainingConnections.push(connection);
                }
            });
            
            node.connections = remainingConnections;
        }
        
        anchorsMounted++;
    });

    // Track when stores should be connected/disconnected
    let shouldConnect = $state(false);
    let shouldDisconnect = $state(false);

    // Handle store connections
    $effect(() => {
        if (shouldConnect && input && connectingFrom?.store && inputsStore) {
            if (key) {
                const currentValue = inputsStore[key];
                if (!currentValue) {
                    storeState[key] = connectingFrom.store;
                } else {
                    storeState[key] = { ...currentValue, ...connectingFrom.store };
                }
            } else {
                storeState['value'] = connectingFrom.store;
            }
            shouldConnect = false;
        }
    });

    // Handle store disconnections
    $effect(() => {
        if (shouldDisconnect && input) {
            if (key) {
                delete storeState[key];
            } else {
                delete storeState['value'];
            }
            shouldDisconnect = false;
        }
    });

    function connectStores() {
        shouldConnect = true;
    }

    function disconnectStore() {
        shouldDisconnect = true;
    }

    // Event handlers
    function handleClick(e: MouseEvent | TouchEvent) {
        if (locked) return;
        if (e.type === 'touchstart') {
            e.preventDefault();
            touchBasedConnection(e as TouchEvent);
            return;
        }

        if (connecting) {
            edgeStore.delete('cursor');
            if (connectingFrom?.anchor === anchor) {
                clearLinking(false);
                return;
            }
            attemptConnection(connectingFrom!.anchor, anchor, e);
        } else if (!input || nodeConnect) {
            createCursorEdge(anchor, cursorAnchor);
            if (anchor.type === 'output') {
                const store = anchor.store;
                connectingFrom = { anchor, store, key: null };
            } else {
                connectingFrom = { anchor, store: null, key: null };
            }
            connecting = true;
        }
    }

    function handleMouseUp(e: MouseEvent | TouchEvent) {
        if (e.type === 'touchend') {
            e.preventDefault();
            return;
        }
        if (!connecting || !connectingFrom) return;
        
        edgeStore.delete('cursor');
        if (hovering) return;
        
        if (nodeConnect && nodeConnectEvent) {
            const element = document.elementFromPoint(
                nodeConnectEvent.clientX,
                nodeConnectEvent.clientY
            );
            if (!element) return;
            
            const nodeElement = element.closest('[data-node]');
            if (!nodeElement) {
                clearLinking(false);
                return;
            }
            
            const nodeId = `N-${nodeElement.id.split('-')[1]}` as NodeKey;
            const targetNode = nodeStore.get(nodeId);
            if (!targetNode) return;
            
            // Convert AnchorStore to entries array and find input anchor
            const anchors = Array.from(Object.entries(targetNode.anchors));
            const defaultAnchorEntry = anchors.find(
                ([_, a]) => (a as Anchor).type === 'input'
            );
            const defaultAnchor = defaultAnchorEntry ? defaultAnchorEntry[1] as Anchor : null;
            if (!defaultAnchor) return;
            
            attemptConnection(connectingFrom.anchor, defaultAnchor, e);
        } else {
            clearLinking(false);
        }
    }

    function touchBasedConnection(e: TouchEvent) {
        edgeStore.delete('cursor');
        const touchPosition = {
            x: e.changedTouches[0].clientX,
            y: e.changedTouches[0].clientY
        };

        const otherAnchor = document.elementFromPoint(touchPosition.x, touchPosition.y);
        if (!otherAnchor) return;

        const parentElement = otherAnchor.parentElement;
        if (!parentElement) return;

        const compoundId: AnchorKey = parentElement.id as AnchorKey;
        const nodeId = compoundId.split('/')[1] as NodeKey;
        const connectingAnchor = nodeStore.get(nodeId)?.anchors.get(compoundId);

        if (!connectingAnchor) return;
        edgeStore.delete('cursor');
        attemptConnection(anchor, connectingAnchor, e);
    }

    function attemptConnection(source: Anchor, target: Anchor, e: MouseEvent | TouchEvent) {
        const success = connectAnchors(source, target);
        if (success) {
            connectStores();
        }
        if (!e.shiftKey) {
            clearLinking(success);
        }
    }

    function disconnectEdge() {
        if (anchor.connected.size > 1) return;

        const sourceAnchor = Array.from(anchor.connected)[0];
        if (sourceAnchor.type === 'input') return;

        destroy();
        if (sourceAnchor.type === 'output') {
            createCursorEdge(sourceAnchor, cursorAnchor, true);
            disconnectStore();
            const store = sourceAnchor.store;
            connectingFrom = { anchor: sourceAnchor, store, key: null };
        } else {
            createCursorEdge(sourceAnchor, cursorAnchor, true);
            connectingFrom = { anchor: sourceAnchor, store: null, key: null };
        }
    }

    function handleAnchorConnection(event: AnchorConnectionEvent) {
        const { node: sourceNode, anchor: sourceAnchor, connectedNode, connectedAnchor } = event;
        if (sourceAnchor === anchor || connectedAnchor === anchor) {
            connectStores();
        }
    }

    function clearLinking(success: boolean) {
        connecting = false;
        connectingFrom = null;
        if (!success) edgeStore.delete('cursor');
    }

    function destroy() {
        const edges = edgeStore.match(anchor);
        edges.forEach((edge) => edgeStore.delete(edge));
    }

    function connectAnchors(source: Anchor, target: Anchor): boolean {
        if (source === target) return false;
        if (source.type === target.type) return false;
        if (!multiple && source.connected.size >= 1) return false;
        if (target.type === 'input' && target.connected.size >= 1) return false;

        const config: EdgeConfig = {
            type: edgeStyle || undefined,
            start: endStyles[0] || undefined,
            end: endStyles[1] || undefined
        };

        if (edgeLabel) {
            config.label = {
                text: edgeLabel
            };
        }

        const edge = createEdge(
            { source, target },
            source.edge || target.edge || null,
            config
        );

        const key = new Set([source, target]);
        edgeStore.add(edge, key);

        // Create connection event with correct properties
        const connectionEvent: AnchorConnectionEvent = {
            node: source.node,
            anchor: source,
            connectedNode: target.node,
            connectedAnchor: target
        };
        handleAnchorConnection(connectionEvent);
        return true;
    }
</script>

<div
    class="anchor"
    class:connecting
    class:hovering
    class:invisible
    bind:this={anchorElement}
    role="button"
    tabindex="0"
    onmousedown={handleClick}
    ontouchstart={handleClick}
    onmouseup={handleMouseUp}
    ontouchend={handleMouseUp}
    {title}
>
    {@render defaultAnchor({
        bgColor,
        output,
        input,
        connecting,
        connected: anchor.connected.size > 0,
        hovering
    })}
</div>

{#snippet defaultAnchor(props: DefaultAnchorProps)}
    <DefaultAnchor {...props} />
{/snippet}

<style>
    .anchor {
        position: relative;
        width: 12px;
        height: 12px;
        margin: 6px;
        cursor: pointer;
        z-index: 2;
    }

    .connecting {
        filter: brightness(1.2);
    }

    .hovering {
        filter: brightness(1.4);
    }

    .invisible {
        opacity: 0;
        pointer-events: none;
    }
</style>