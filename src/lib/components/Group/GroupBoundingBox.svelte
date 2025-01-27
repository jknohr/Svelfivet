<script lang="ts">
    import type { CSSColorString, Dimensions, XYPair } from '$lib/types';

    interface Props {
        dimensions: Dimensions;
        position: XYPair;
        color: CSSColorString;
        groupName: string;
        onclick?: (e: MouseEvent) => void;
    }

    let { 
        dimensions: { width, height },
        position,
        color,
        groupName,
        onclick
    } = $props();

    let id = `${groupName}-bounding-box`;
</script>

<div
    role="button"
    tabindex="0"
    id={id}
    style:top={`${position.y}px`}
    style:left={`${position.x}px`}
    style:width={`${width}px`}
    style:height={`${height}px`}
    style="border: solid 4px {color};"
    onclick={onclick} // Correct usage for event handling
>
    <div class="bounding-box" style="background-color: {color};"></div>
</div>

<style>
    .bounding-box {
        width: 100%;
        height: 100%;
        opacity: 0.25;
        z-index: -4;
        pointer-events: none;
    }
</style>