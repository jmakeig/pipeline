<script>
	/** @type {import('./$types').PageData} */
	export let data;
</script>

<h1>Customers</h1>
{#await data.workloads then workloads}
	<ol>
		{#each workloads as workload}
			<li>{workload.label}</li>
		{/each}
	</ol>
{/await}
