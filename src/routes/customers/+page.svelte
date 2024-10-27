<script>
	/** @type {import('./$types').PageData} */
	export let data;
</script>

<h1>Customers</h1>
<p>asdf</p>
<!-- <pre>{JSON.stringify(data.workloads)}</pre> -->
<ol>
	{#each data.workloads as workload}
		<li>{workload.label}</li>
	{/each}
</ol>
