<script lang="ts">
	import { Anchor, Node } from '$lib';

	$state.text = 'Test';
	$state.checked = true;
	$state.color = '#ff0000';
	$state.date = new Date();
	$state.datetime = new Date();
	$state.email = '';
	$state.month = '';
	$state.number = 0;
	$state.password = '';
	$state.radio = '';
	$state.range = 0;
	$state.search = '';
	$state.tel = '';
	$state.url = '';
	$state.week = '';

	$derived formattedDate = $state.date.toLocaleDateString();
	$derived formattedDatetime = $state.datetime.toLocaleString();

	$effect(() => {
		console.log('Text changed:', $state.text);
	});
</script>

<Node id="input" bgColor="black" label="StartNode" borderRadius={10} >
	{@render children({ destroy })}
		<div class="node">
			<input id="text-test" type="text" bind:value={$state.text} />
			<input id="checkbox-test" type="checkbox" bind:checked={$state.checked} />
			<input type="color" bind:value={$state.color} />
			<input type="date" bind:value={$state.date} />
			<input type="datetime-local" bind:value={$state.datetime} />
			<input type="email" bind:value={$state.email} />
			<input type="month" bind:value={$state.month} />
			<input type="number" bind:value={$state.number} />
			<input type="password" bind:value={$state.password} />
			<input type="radio" bind:value={$state.radio} />
			<input type="range" bind:value={$state.range} />
			<input type="search" bind:value={$state.search} />
			<input type="tel" bind:value={$state.tel} />
			<select id="numberSelect">
				<option value="1">1</option>
				<option value="2">2</option>
				<option value="3">3</option>
				<option value="4">4</option>
				<option value="5">5</option>
				<option value="6">6</option>
				<option value="7">7</option>
				<option value="8">8</option>
				<option value="9">9</option>
				<option value="10">10</option>
			</select>
			<textarea id="textarea-test"></textarea>
			<button onclick={$state.destroy}>Test</button>
		</div>
	{@/render}
</Node>

<style>
	.node {
		width: 400px;
		height: 400px;
	}
</style>
