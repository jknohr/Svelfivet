<script lang="ts">
    import RealEstateBody from '$lib/components/Vistas/real-estate/RealEstateBody.svelte';
</script>

<RealEstateBody />

<body>
	<Svelvet minimap title="test" controls>
		<!-- buttons on lower level node -->
		<Connector />
		<Node bgColor="red" inputs={4} position={{ x: 600, y: 200 }}>
			<button onclick={() => widthCount++} aria-label="Increment width"></button>
			{#each { length: widthCount } as item}
				<div>Height</div>
			{/each}
			<!-- <button on:click={() => alert('hi')}>ALERTe</button> -->
			<button
				style="cursor: pointer;"
				onclick={() => {
					console.log('Graph on user interaction:', graph);
					if (graph) getJSONState(graph);
				}}>SAVE STATE</button
				>
			<button onclick={logCurrentGraphState}>Log Current Graph State</button>
		</Node>
		<!-- text field -->
		<Node inputs={5} position={{ x: 600, y: 600 }}>
			<TextField placeholder="name" />
		</Node>
		<!-- blue node -->
		<Node let:selected dimensions={{ width: 400, height: 100 }}>
			<div class="node" class:selected>
				<Resizer width height rotation />
			</div>
		</Node>
		<!-- top gray node -->
		<Node useDefaults dimensions={{ width: 400, height: 300 }} position={{ x: 100, y: 300 }}>
			<div class="anchor">
				<Anchor nodeConnect />
			</div>
			<Anchor nodeConnect />
		</Node>
		{#each { length: totalNodes } as node}
			<Node let:connect useDefaults position={{ x: Math.random() * 200, y: Math.random() * 400 }} />
		{/each}

		<ThemeToggle slot="toggle" />
		<ContrastTheme slot="contrast" />
	</Svelvet>
</body>

<style>
	.node {
		width: 100%;
		height: 100%;
		background-color: aqua;
		border: 2px solid black;
	}
	.anchor {
		position: absolute;
		right: 10px;
	}
	body {
		width: 100vw;
		height: 100vh;
		margin: 0;
		padding: 0;
	}
	:root[theme='dark'] {
		--background-color: black;
		--node-color: white;
	}
	:root[theme='light'] {
		--background-color: purple;
		--node-color: green;
	}
</style>