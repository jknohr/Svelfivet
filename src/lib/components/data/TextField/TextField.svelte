<script lang="ts">
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';

	let { placeholder = '' } = $props();
	const textStore = getContext<Writable<string>>('textStore');
</script>

<input
	{placeholder}
	type="text"
	bind:value={$textStore}
	onkeydown={(event) => event.stopPropagation()}
	onclick={(event) => event.stopPropagation()}
	onmousedown={(event) => event.stopPropagation()}
/>
