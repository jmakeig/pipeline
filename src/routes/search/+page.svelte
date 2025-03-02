<script>
	/** @type {{ data: import('./$types').PageData }} */
	let { data } = $props();
</script>

<ol>
	{#each data.results as result}
		<li><a href={result.resource}>{result.entity}</a> {@html result.snippet}</li>
	{/each}
</ol>

<style>
	mark {
		background: yellow;
	}
</style>
