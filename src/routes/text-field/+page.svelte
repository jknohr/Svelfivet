<script lang="ts">
	import { Svelvet, Node, TextField } from '$lib';
	import { setContext } from 'svelte';

	let text = $state('');
	$effect(() => {
		setContext('textStore', text);
	});
</script>

<Svelvet width={1000} height={1000}>
	<Node width={400} height={200} useDefaults node={{ content: TextField, props: { placeholder: 'test placeholder' } }} />
	<Node width={400} height={200} position={{ x: 0, y: 300 }} useDefaults node={{ content: text }} />
</Svelvet>
