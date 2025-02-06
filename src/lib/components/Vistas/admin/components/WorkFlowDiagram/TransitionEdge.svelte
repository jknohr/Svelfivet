<svelte:options runes />

<script lang="ts">
    type EdgeStyle = 'success' | 'failure';

    let { edge, options } = $props<{
        edge: { id: string; label: string; edgeStyle: EdgeStyle };
        options: {
            path: string;
            labelX: number;
            labelY: number;
            delete: (id: string) => void;
        };
    }>();

    let edgeStyle = $derived.by(() => {
        switch (edge.edgeStyle) {
            case 'success':
                return {
                    stroke: '#4CAF50',
                    fill: '#81C784',
                    textFill: '#1B5E20'
                };
            case 'failure':
                return {
                    stroke: '#F44336',
                    fill: '#E57373',
                    textFill: '#B71C1C'
                };
            default:
                return {
                    stroke: '#42A5F5',
                    fill: '#42A5F5',
                    textFill: '#1565C0'
                };
        }
    });

    function handleDelete() {
        options.delete(edge.id);
    }
</script>

<g 
    class="transition-edge" 
    role="group" 
    aria-label={`Transition edge from ${edge.source} to ${edge.target} with label ${edge.label}`}
>
    <path 
        d={options.path} 
        stroke={edgeStyle.stroke} 
        stroke-width="2" 
        fill="none" 
        role="presentation" 
    />
    <text 
        x={options.labelX} 
        y={options.labelY} 
        font-size="12" 
        fill={edgeStyle.textFill} 
        text-anchor="middle"
        role="presentation"
    >
        {edge.label}
    </text>
    <circle 
        cx={options.labelX} 
        cy={options.labelY + 10} 
        r="8" 
        fill={edgeStyle.fill} 
        role="presentation" 
    />
    <text 
        x={options.labelX} 
        y={options.labelY + 14} 
        font-size="10" 
        fill="#FFFFFF" 
        text-anchor="middle"
        role="presentation"
    >
        {edge.label.charAt(0).toUpperCase()}
    </text>
    <g 
        onclick={handleDelete}
        role="button"
        aria-label="Delete transition"
        tabindex="0"
        onkeydown={(e) => e.key === 'Enter' && handleDelete()}
        style="cursor: pointer;"
    >
        <circle 
            cx={options.labelX} 
            cy={options.labelY + 30} 
            r="12" 
            fill="#FFCDD2" 
            role="presentation" 
        />
        <text 
            x={options.labelX} 
            y={options.labelY + 34} 
            font-size="10" 
            fill="#FFFFFF" 
            text-anchor="middle"
            role="presentation"
        >
            Delete
        </text>
    </g>
</g>

<style>
    .transition-edge {
        position: relative;
    }

    path {
        cursor: pointer;
    }

    text {
        cursor: pointer;
    }

    circle {
        cursor: pointer;
    }
</style>