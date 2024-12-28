<script>
	let { children = null, value, readonly = false, stages=null} = $props();
	/** @type {Record<number, string>} */
	const colors = {
		0: '#00bfa0',
		1: '#b3d4ff',
		2: '#dc0ab4',
		3: '#ffa300',
		4: '#9b19f5',
		5: '#e6d800',
		97: '#50e991',
		98: '#0bb4ff',
		99: '#e60049',
		100: '#ccc'
	};
	// https://www.heavy.ai/blog/12-color-palettes-for-telling-better-stories-with-your-data
	// [#e60049", "#0bb4ff", "#50e991", "#e6d800", "#9b19f5", "#ffa300", "#dc0ab4", "#b3d4ff", "#00bfa0"]
</script>

{#if readonly}
	<span class="stage stage-{value.stage}" title="{value.stage} - {value.name}">
		<span class="indicator" style="background-color: {colors[value.stage]};">{value.stage}</span>
		{#if children}
			{@render children()}
		{:else}
			{value.name}
		{/if}
	</span>
{:else}
	<select>
		<option value=""> </option>
		{#each stages as stage}
			<option value={stage.stage}>{stage.stage}: {stage.name}</option>
		{/each}
	</select>
{/if}

<style>
	.stage {
		display: inline-block;
	}
	.indicator {
		display: inline-block;
		width: 1.25em;
		height: 1.25em;
		border-radius: 1em;
		background-color: black;
		color: transparent;
	}
</style>
