<script lang="ts">
	import { onDestroy } from 'svelte';
	import CustomAnchor from './CustomAnchor.svelte';
	import { Node, Anchor } from '$lib';

	interface AudioState {
		bass: number;
		treble: number;
		volume: number;
	}

	// Audio state
	// @ts-ignore - Library type definitions need updating for Svelte 5 runes
	let audioContext = $state(new AudioContext());
	// @ts-ignore - Library type definitions need updating for Svelte 5 runes
	let audioBuffer = $state(null);
	// @ts-ignore - Library type definitions need updating for Svelte 5 runes
	let audioSource = $state(null);
	// @ts-ignore - Library type definitions need updating for Svelte 5 runes
	let bassFilter = $state(audioContext.createBiquadFilter());
	// @ts-ignore - Library type definitions need updating for Svelte 5 runes
	let trebleFilter = $state(audioContext.createBiquadFilter());
	// @ts-ignore - Library type definitions need updating for Svelte 5 runes
	let gainNode = $state(audioContext.createGain());
	
	// @ts-ignore - Library type definitions need updating for Svelte 5 runes
	let state = $state({
		bass: 2,
		treble: 2,
		volume: 0.01
	});

	// Create store interface for output
	const outputStore = {
		subscribe: (subscriber: (value: typeof state) => void) => {
			subscriber(state);
			return () => {};
		},
		unsubscribe: () => {},
		set: null,
		update: null
	};

	let song = 'https://otnmsonvlxvlokpdgsky.supabase.co/storage/v1/object/public/ape-escape-time-station/What%20is%20Love.mp3?t=2023-05-18T05%3A01%3A32.321Z';

	// Configure filters
	if (bassFilter) {
		bassFilter.type = 'lowshelf';
	}
	if (trebleFilter) {
		trebleFilter.type = 'highshelf';
	}

	// Connect nodes
	if (bassFilter && trebleFilter && gainNode) {
		bassFilter.connect(trebleFilter);
		trebleFilter.connect(gainNode);
		gainNode.connect(audioContext.destination);
	}

	// Update parameters based on state
	$effect(() => {
		if (gainNode) {
			gainNode.gain.value = state.volume;
		}
	});

	$effect(() => {
		if (bassFilter) {
			bassFilter.gain.value = state.bass;
		}
	});

	$effect(() => {
		if (trebleFilter) {
			trebleFilter.gain.value = state.treble;
		}
	});

	onDestroy(() => {
		stop();
		audioContext?.close();
	});

	async function loadAudio(url: string) {
		const response = await fetch(url);
		const arrayBuffer = await response.arrayBuffer();
		audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
	}

	function play() {
		if (!audioBuffer || !bassFilter) return;
		audioSource = audioContext.createBufferSource();
		audioSource.buffer = audioBuffer;
		audioSource.connect(bassFilter);
		audioSource.start();
	}

	function stop() {
		if (audioSource) {
			audioSource.stop();
			audioSource.disconnect();
			audioSource = null;
		}
	}

	function handleInputChange(key: keyof typeof state, value: number) {
		state[key] = value;
	}
</script>

{/* @ts-ignore - Library type definitions need updating for Svelte 5 */}
<Node useDefaults id={1} position={{ x: 550, y: 300 }}>
	{#snippet node({ selected }: { selected: boolean })}
		<div class="contentWrapper">
			<div class="node" class:selected>
				<button onclick={() => loadAudio(song)}>Load Audio</button>
				<button onclick={play}>Play</button>
				<button onclick={stop}>Stop</button>
			</div>
			<div class="audio_controls">
				<div class="col input-anchors">
					{#each Object.keys(state) as key}
						{/* @ts-ignore - Library type definitions need updating for Svelte 5 */}
						<Anchor 
							id={key} 
							value={state[key]} 
							onchange={(v: number) => handleInputChange(key as keyof typeof state, v)} 
							input
						>
							{#snippet anchor({ hovering, connecting, linked }: { hovering: boolean; connecting: boolean; linked: boolean })}
								<CustomAnchor {hovering} {connecting} {linked} />
							{/snippet}
						</Anchor>
					{/each}
				</div>
				<div class="col col_2">
					<div id="bass-level">
						Bass:
						<span>{bassFilter?.gain.value ?? 0} dB</span>
					</div>
					<div id="treble-level">
						Treble:
						<span>{trebleFilter?.gain.value ?? 0} dB</span>
					</div>
					<div id="volume-level">
						Volume:
						<span>{state.volume.toFixed(2)}%</span>
					</div>
				</div>
			</div>
		</div>
	{/snippet}
</Node>

<style>
	.contentWrapper {
		padding: 1rem;
	}
	.audio_controls {
		padding-top: 1rem;
	}
	.col {
		line-height: 1.5rem;
	}
	.input-anchors {
		position: absolute;
		display: flex;
		flex-direction: column;
		gap: 12px;
		left: -24px;
	}
	button {
		border-radius: 4px;
	}
</style>
