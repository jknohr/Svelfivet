<!-- ColorWheel.svelte -->
<svelte:options runes={true} />

<script lang="ts">
    let props = $props<{
        color: string;
        onchange: (color: string) => void;
    }>();

    let hue = $state(0);
    let saturation = $state(100);
    let lightness = $state(50);
    let alpha = $state(100);

    // Convert hex to HSL on mount
    $effect(() => {
        const result = hexToHSL(props.color);
        if (result) {
            hue = result.h;
            saturation = result.s;
            lightness = result.l;
            alpha = result.a * 100;
        }
    });

    // Update color when HSL values change
    $effect(() => {
        const color = `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha / 100})`;
        props.onchange(HSLAToHex(hue, saturation, lightness, alpha / 100));
    });

    function hexToHSL(hex: string) {
        let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (!result) return null;

        let r = parseInt(result[1], 16) / 255;
        let g = parseInt(result[2], 16) / 255;
        let b = parseInt(result[3], 16) / 255;

        let max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h = 0, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
        } else {
            let d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }

        return {
            h: Math.round(h * 360),
            s: Math.round(s * 100),
            l: Math.round(l * 100),
            a: 1
        };
    }

    function HSLAToHex(h: number, s: number, l: number, a: number): string {
        l /= 100;
        const a2 = s * Math.min(l, 1 - l) / 100;
        const f = (n: number) => {
            const k = (n + h / 30) % 12;
            const color = l - a2 * Math.max(Math.min(k - 3, 9 - k, 1), -1);
            return Math.round(255 * color).toString(16).padStart(2, '0');
        };
        return `#${f(0)}${f(8)}${f(4)}`;
    }
</script>

<div class="color-wheel-container">
    <!-- Hue wheel -->
    <div class="hue-wheel">
        <div class="hue-pointer" style="transform: rotate({hue}deg)"></div>
        <input 
            type="range" 
            min="0" 
            max="360" 
            bind:value={hue}
            class="hue-input"
        />
    </div>

    <!-- Saturation and Lightness pad -->
    <div 
        class="sl-pad"
        style="background: hsl({hue}, 100%, 50%)"
    >
        <div 
            class="sl-pointer"
            style="
                bottom: {lightness}%;
                left: {saturation}%;
                background: hsla({hue}, {saturation}%, {lightness}%, {alpha/100})
            "
        ></div>
        <input 
            type="range" 
            min="0" 
            max="100" 
            bind:value={saturation}
            class="saturation-input"
        />
        <input 
            type="range" 
            min="0" 
            max="100" 
            bind:value={lightness}
            class="lightness-input"
        />
    </div>

    <!-- Alpha slider -->
    <div class="alpha-slider">
        <div 
            class="alpha-background"
            style="background: linear-gradient(to right, transparent, hsla({hue}, {saturation}%, {lightness}%, 1))"
        ></div>
        <input 
            type="range" 
            min="0" 
            max="100" 
            bind:value={alpha}
            class="alpha-input"
        />
    </div>

    <!-- Color values -->
    <div class="color-values">
        <div class="color-preview" style="background: hsla({hue}, {saturation}%, {lightness}%, {alpha/100})"></div>
        <div class="value-inputs">
            <input type="text" value={props.color} readonly />
            <div class="hsl-values">
                <span>H: {hue}°</span>
                <span>S: {saturation}%</span>
                <span>L: {lightness}%</span>
                <span>A: {(alpha/100).toFixed(2)}</span>
            </div>
        </div>
    </div>
</div>

<style>
    .color-wheel-container {
        padding: 1rem;
        background: var(--surface-color);
        border-radius: 0.5rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .hue-wheel {
        width: 200px;
        height: 200px;
        position: relative;
        background: conic-gradient(
            red, yellow, lime, cyan, blue, magenta, red
        );
        border-radius: 50%;
    }

    .hue-pointer {
        position: absolute;
        width: 2px;
        height: 100px;
        background: white;
        transform-origin: bottom center;
        left: calc(50% - 1px);
        bottom: 50%;
        pointer-events: none;
    }

    .sl-pad {
        width: 200px;
        height: 200px;
        position: relative;
        background: linear-gradient(
            to right,
            white,
            transparent
        );
    }

    .sl-pad::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(
            to top,
            black,
            transparent
        );
    }

    .sl-pointer {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        border: 2px solid white;
        position: absolute;
        transform: translate(-50%, 50%);
        pointer-events: none;
    }

    .alpha-slider {
        height: 20px;
        position: relative;
        border-radius: 10px;
        overflow: hidden;
    }

    .alpha-background {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
    }

    .color-values {
        display: flex;
        gap: 1rem;
        align-items: center;
    }

    .color-preview {
        width: 40px;
        height: 40px;
        border-radius: 0.25rem;
        border: 1px solid var(--border-color);
    }

    .value-inputs {
        flex: 1;
    }

    .hsl-values {
        display: flex;
        gap: 1rem;
        margin-top: 0.5rem;
        font-size: 0.875rem;
        color: var(--text-light);
    }

    input[type="range"] {
        width: 100%;
    }

    input[type="text"] {
        width: 100%;
        padding: 0.25rem;
        border: 1px solid var(--border-color);
        border-radius: 0.25rem;
    }
</style>
