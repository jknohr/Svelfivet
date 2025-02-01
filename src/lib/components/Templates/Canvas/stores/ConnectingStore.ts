import type { Anchor } from '$lib/components/Templates/Canvas/types';
import type { ConnectingFrom } from '$lib/components/Templates/Canvas/types/logic';

// State declarations using runes
let connectingFrom = $state<ConnectingFrom | null>(null);
let connectingTo = $state<Anchor | null>(null);

// Derived state
let isConnecting = $derived(!!connectingFrom);
let canConnect = $derived(!!connectingFrom && !!connectingTo);

// Connection management
function startConnecting(from: ConnectingFrom) {
    connectingFrom = from;
}

function updateConnectingTo(to: Anchor | null) {
    connectingTo = to;
}

function clearConnecting() {
    connectingFrom = null;
    connectingTo = null;
}

// Development mode inspection
// @ts-ignore
if (import.meta?.env?.DEV) {
    $effect.pre(() => {
        $inspect(connectingFrom, 'Connecting From');
        $inspect(connectingTo, 'Connecting To');
    });
}

export {
    connectingFrom,
    connectingTo,
    isConnecting,
    canConnect,
    startConnecting,
    updateConnectingTo,
    clearConnecting
}; 